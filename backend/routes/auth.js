import express from 'express';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';

const router = express.Router();

// In-memory nonce store: address -> { nonce, expires }
const nonces = new Map();

// Clean up expired nonces periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of nonces) {
    if (now > val.expires) nonces.delete(key);
  }
}, 60_000);

// POST /api/auth/nonce — returns a one-time nonce for the given wallet
router.post('/nonce', (req, res) => {
  const { address } = req.body;
  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Valid Ethereum address required' });
  }
  const nonce = Math.random().toString(36).slice(2) + Date.now();
  nonces.set(address.toLowerCase(), { nonce, expires: Date.now() + 5 * 60_000 });
  res.json({ nonce });
});

// POST /api/auth/verify — verify MetaMask signature, return JWT
router.post('/verify', (req, res) => {
  const { address, signature } = req.body;
  if (!address || !signature) {
    return res.status(400).json({ error: 'Address and signature required' });
  }

  const entry = nonces.get(address.toLowerCase());
  if (!entry || Date.now() > entry.expires) {
    return res.status(400).json({ error: 'Nonce expired or not found. Please try again.' });
  }

  const message = `Welcome to BlockNotice\n\nSign this message to verify your wallet.\n\nNonce: ${entry.nonce}`;
  const message = `Welcome to NoticeLedger\n\nSign this message to verify your wallet.\n\nNonce: ${entry.nonce}`;

  try {
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature does not match address' });
    }
    nonces.delete(address.toLowerCase());

    const adminAddress = process.env.ADMIN_WALLET_ADDRESS?.toLowerCase();
    const role = address.toLowerCase() === adminAddress ? 'admin' : 'user';

    const token = jwt.sign(
      { address: address.toLowerCase(), role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role, address: address.toLowerCase() });
  } catch (err) {
    console.error('Signature error:', err.message);
    res.status(401).json({ error: 'Signature verification failed' });
  }
});

export default router;
