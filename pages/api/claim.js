import { callFlopcoin } from '../../lib/flopcoinRPC';
import axios from 'axios';
import { addToTotalPaidOut } from '../../lib/inMemoryStats';

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
    return xForwardedFor.split(',')[0].trim();
  }
  return req.socket.remoteAddress;
}

function cleanupClaimHistory() {
  const now = Date.now();
  for (const [key, expiry] of Object.entries(claimHistory)) {
    if (expiry <= now) {
      delete claimHistory[key];
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, hcaptchaToken } = req.body;
  if (!address || !hcaptchaToken) {
    return res.status(400).json({ error: 'Missing address or hCaptcha token' });
  }

  try {
    const verifyURL = 'https://hcaptcha.com/siteverify';
    const secretKey = process.env.HCAPTCHA_SECRET_KEY;

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

  cleanupClaimHistory();

  const userIdentifier = getUserIdentifier(req);
  const now = Date.now();
  const oneHour = 1000 * 60 * 60;

  if (claimHistory[userIdentifier] && claimHistory[userIdentifier] > now) {
    return res.status(429).json({ error: 'You have already claimed in the last hour!' });
  }

  try {
    const validate = await callFlopcoin('validateaddress', [address]);
    if (!validate || !validate.isvalid) {
      return res.status(400).json({ error: 'Invalid FLOP address!' });
    }

    const amountToSend = parseFloat(process.env.NEXT_PUBLIC_FAUCET_REWARD);
    const txid = await callFlopcoin('sendtoaddress', [address, amountToSend]);

    claimHistory[userIdentifier] = now + oneHour;

    // Update the in-memory counter.
    addToTotalPaidOut(amountToSend);

    return res.status(200).json({ txid });
  } catch (error) {
    console.error('Error processing payout:', error);
    return res.status(500).json({ error: error.message });
  }
}
