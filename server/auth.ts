import { Router } from 'express';
import crypto from 'crypto';
import { ethers } from 'ethers';
import 'express-session';

// In-memory store for nonces (in production, use Redis or a database)
const nonceStore: Record<string, string> = {};

const router = Router();

// Generate a nonce for the given wallet address
router.get('/nonce', (req, res) => {
  const { address } = req.query;
  
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address is required' });
  }
  
  // Generate a random nonce
  const nonce = crypto.randomBytes(32).toString('hex');
  
  // Store the nonce for this address (with 10 minute expiration)
  nonceStore[address.toLowerCase()] = nonce;
  
  // Set a timeout to remove the nonce after 10 minutes
  setTimeout(() => {
    delete nonceStore[address.toLowerCase()];
  }, 10 * 60 * 1000);
  
  return res.json({ nonce });
});

// Verify a signature
router.post('/verify', (req, res) => {
  const { address, signature, message } = req.body;
  
  if (!address || !signature || !message) {
    return res.status(400).json({ error: 'Address, signature, and message are required' });
  }
  
  const lowerCaseAddress = address.toLowerCase();
  
  // Check if we have a nonce for this address
  const storedNonce = nonceStore[lowerCaseAddress];
  if (!storedNonce) {
    return res.status(400).json({ error: 'No nonce found for this address or nonce expired' });
  }
  
  // Check if the message contains the correct nonce
  if (!message.includes(storedNonce)) {
    return res.status(400).json({ error: 'Invalid nonce in message' });
  }
  
  try {
    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // Check if the recovered address matches the claimed address
    if (recoveredAddress.toLowerCase() !== lowerCaseAddress) {
      return res.status(401).json({ 
        authenticated: false, 
        error: 'Signature verification failed' 
      });
    }
    
    // Authentication successful
    if (req.session) {
      // Store the authenticated address in the session
      req.session.walletAddress = lowerCaseAddress;
      req.session.authenticated = true;
    }
    
    // Clean up the nonce
    delete nonceStore[lowerCaseAddress];
    
    return res.json({ 
      authenticated: true,
      address: lowerCaseAddress
    });
  } catch (error) {
    console.error('Signature verification error:', error);
    return res.status(401).json({ 
      authenticated: false, 
      error: 'Invalid signature' 
    });
  }
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.session && req.session.authenticated && req.session.walletAddress) {
    return res.json({
      authenticated: true,
      address: req.session.walletAddress
    });
  } else {
    return res.json({
      authenticated: false
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ success: true });
    });
  } else {
    res.json({ success: true });
  }
});

export default router;