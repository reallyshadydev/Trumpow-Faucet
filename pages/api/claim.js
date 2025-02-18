import { callFlopcoin } from '../../lib/flopcoinRPC';
import axios from 'axios';

// In-memory rate limiting. In production, use a persistent store (e.g., Redis or a database).
const claimHistory = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, hcaptchaToken } = req.body;
  if (!address || !hcaptchaToken) {
    return res.status(400).json({ error: 'Missing address or hCaptcha token' });
  }

  // 1) Verify hCaptcha token using URL-encoded form data
  try {
    const verifyURL = 'https://hcaptcha.com/siteverify';
    const secretKey = process.env.HCAPTCHA_SECRET_KEY; // Server-only variable

    // Build URL-encoded form data
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
      return res.status(400).json({ error: 'Invalid hCaptcha', details: verifyResponse.data });
    }
  } catch (err) {
    console.error('Failed to verify hCaptcha:', err);
    return res.status(500).json({ error: 'Failed to verify hCaptcha' });
  }

  // 2) Check if this user (by IP) has claimed within the last hour
  const userIdentifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const oneHour = 1000 * 60 * 60;

  if (claimHistory[userIdentifier] && claimHistory[userIdentifier] > now) {
    return res.status(429).json({ error: 'You have already claimed in the last hour.' });
  }

  // 3) Send 100 FLOP via RPC to the provided address
  try {
    // Optionally, you can validate the address first:
    const validate = await callFlopcoin('validateaddress', [address]);
    if (!validate || !validate.isvalid) {
      return res.status(400).json({ error: 'Invalid FLOP address' });
    }

    const amountToSend = 100; // 100 FLOP per claim
    const txid = await callFlopcoin('sendtoaddress', [address, amountToSend]);

    // 4) Record the claim to enforce the one-hour limit
    claimHistory[userIdentifier] = now + oneHour;

    return res.status(200).json({ txid });
  } catch (error) {
    console.error('Error processing payout:', error);
    return res.status(500).json({ error: error.message });
  }
}
