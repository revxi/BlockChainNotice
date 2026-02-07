const express = require('express');
const mongoose = require('mongoose');
const { ethers } = require('ethers');
const { startListener } = require('./listener');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blocknotice';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Blockchain Configuration
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Should be set after deployment

if (!CONTRACT_ADDRESS) {
  console.warn("⚠️ CONTRACT_ADDRESS is not set. Listener will not start until configured.");
} else {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  startListener(CONTRACT_ADDRESS, provider);
}

app.get('/', (req, res) => {
  res.send('BlockNotice Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
