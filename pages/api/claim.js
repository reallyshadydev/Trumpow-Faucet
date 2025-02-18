import { callFlopcoin } from '../../lib/flopcoinRPC';
import axios from 'axios';

// In-memory rate limiting store
const claimHistory = {};

/**
 * Extracts a user identifier (IP address) from the request.
 * Tries to use the X-Forwarded-For header (splitting multiple addresses),
 * falling back to the remote address.
 */
function getUserIdentifier(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // If there are multiple IPs, take the first one.
    return xForwardedFor.split(',')[0].trim();
  }
  return req.socket.remoteAddress;
}

/**
 * Optionally clean expired entries.
 * This helps prevent the in-memory store from growing indefinitely.
 */
function cleanupClaimHistory() {
  const now = Date.now();
  for (const [key, expiry] of Object.entries(claimHistory)) {
    if (expiry <= now) {
      delete claimHistory[key];
    }
  }
}

export default async function handler(req, res) {
  // Only accept POST requests.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, hcaptchaToken } = req.body;
  if (!address || !hcaptchaToken) {
    return res.status(400).json({ error: 'Missing address or hCaptcha token' });
  }

  // 1) Verify hCaptcha token using URL-encoded form data.
  try {
    const verifyURL = 'https://hcaptcha.com/siteverify';
    const secretKey = process.env.HCAPTCHA_SECRET_KEY; // Server-only variable

    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', hcaptchaToken);

    const verifyResponse = await axios.post(verifyURL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!verifyResponse.data.success) {
      console.error('hCaptcha verification error:', verifyResponse.data);
      return res.status(400).json({ error: 'Invalid Captcha!', details: verifyResponse.data });
    }
  } catch (err) {
    console.error('Failed to verify hCaptcha:', err);
    return res.status(500).json({ error: 'Failed to verify captcha!' });
  }

  // 2) Check rate limiting using a better user identifier.
  // Clean up expired entries (optional but useful for a long-running server).
  cleanupClaimHistory();

  const userIdentifier = getUserIdentifier(req);
  const now = Date.now();
  const oneHour = 1000 * 60 * 60;

  if (claimHistory[userIdentifier] && claimHistory[userIdentifier] > now) {
    return res.status(429).json({ error: 'You have already claimed in the last hour!' });
  }

  // 3) Process the payout
  try {
    // Validate the provided FLOP address.
    const validate = await callFlopcoin('validateaddress', [address]);
    if (!validate || !validate.isvalid) {
      return res.status(400).json({ error: 'Invalid FLOP address!' });
    }

    const amountToSend = process.env.FAUCET_REWARD; // FLOP reward per claim from config
    const txid = await callFlopcoin('sendtoaddress', [address, amountToSend]);

    // 4) Record the claim to enforce the one-hour limit.
    claimHistory[userIdentifier] = now + oneHour;

    return res.status(200).json({ txid });
  } catch (error) {
    console.error('Error processing payout:', error);
    return res.status(500).json({ error: error.message });
  }
}