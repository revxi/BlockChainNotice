const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

const { ethers } = require('ethers');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Contract config
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || process.env.VITE_CONTRACT_ADDRESS;
let ABI = [];
try {
  ABI = require(path.join(__dirname, '..', '..', 'frontend', 'src', 'utils', 'abi.json'));
} catch (e) {
  try {
    ABI = require(path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'utils', 'abi.json'));
  } catch (err) {
    console.warn('ABI file not found for backend contract calls. Backend /api endpoints will be limited.');
  }
}

const RPC_URL = process.env.RPC_URL || undefined;
const NETWORK = process.env.ETHEREUM_NETWORK || 'sepolia';
const provider = RPC_URL ? new ethers.providers.JsonRpcProvider(RPC_URL) : ethers.getDefaultProvider(NETWORK);
let contract = null;
if (CONTRACT_ADDRESS && ABI && ABI.length) {
  try {
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  } catch (e) {
    console.warn('Failed to instantiate contract on backend:', e.message);
  }
}

// Middleware
app.use(helmet());
app.use(express.json());

// CORS Configuration
if (process.env.NODE_ENV === 'development') {
  // Allow any origin in development to make testing across LAN easier
  app.use(cors({ origin: true, credentials: true }));
} else {
  app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5002",
      process.env.FRONTEND_URL || "https://blocknotice.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
}

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "BlockNotice Backend Running", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Get all notices (reads from blockchain via provider + contract ABI)
app.get('/api/notices', async (req, res) => {
  if (!contract) return res.status(500).json({ error: 'Contract not configured for backend.' });
  try {
    const raw = await contract.getAllNotices();
    const notices = (raw || []).map((n) => ({
      id: n.id.toString(),
      title: n.title,
      content: n.content,
      author: n.author,
      timestamp: n.timestamp.toString(),
      date: new Date(Number(n.timestamp) * 1000).toISOString(),
    }));
    res.json({ notices });
  } catch (err) {
    console.error('Error fetching notices from contract:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Get single notice by id
app.get('/api/notices/:id', async (req, res) => {
  if (!contract) return res.status(500).json({ error: 'Contract not configured for backend.' });
  const id = req.params.id;
  try {
    const n = await contract.getNotice(id);
    if (!n) return res.status(404).json({ error: 'Notice not found' });
    const notice = {
      id: n.id.toString(),
      title: n.title,
      content: n.content,
      author: n.author,
      timestamp: n.timestamp.toString(),
      date: new Date(Number(n.timestamp) * 1000).toISOString(),
    };
    res.json({ notice });
  } catch (err) {
    console.error('Error fetching notice:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch notice' });
  }
});

// Verified records (same as notices but kept for semantic API)
app.get('/api/verified', async (req, res) => {
  if (!contract) return res.status(500).json({ error: 'Contract not configured for backend.' });
  try {
    const raw = await contract.getAllNotices();
    const notices = (raw || []).map((n) => ({
      id: n.id.toString(),
      title: n.title,
      content: n.content,
      author: n.author,
      timestamp: n.timestamp.toString(),
      date: new Date(Number(n.timestamp) * 1000).toISOString(),
      verified: true,
    }));
    res.json({ verified: notices });
  } catch (err) {
    console.error('Error fetching verified records:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch verified records' });
  }
});

// Basic analytics
app.get('/api/analytics', async (req, res) => {
  if (!contract) return res.status(500).json({ error: 'Contract not configured for backend.' });
  try {
    const raw = await contract.getAllNotices();
    const notices = (raw || []).map((n) => ({
      id: n.id.toString(),
      title: n.title,
      content: n.content,
      timestamp: Number(n.timestamp),
    }));
    const total = notices.length;
    const avgTitle = total ? Math.round(notices.reduce((s, n) => s + (n.title?.length || 0), 0) / total) : 0;
    const latest = notices[0] ? new Date(notices[0].timestamp * 1000).toISOString() : null;
    res.json({ totalNotices: total, averageTitleLength: avgTitle, latestPublication: latest });
  } catch (err) {
    console.error('Error computing analytics:', err.message || err);
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

// API Health endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server (only in development/Render, not in Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 BlockNotice Backend running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 CORS enabled for: ${process.env.FRONTEND_URL || "https://blocknotice.vercel.app"}`);
  });
}

module.exports = app;
