const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const postgres = require('pg');
const path = require('path');

dotenv.config();

const { ethers } = require('ethers');
const { calculateHash, getGenesisHash, verifyChain, verifySingleNotice } = require('../../backend/utils/blockchain');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// DATABASE SETUP (PostgreSQL with Tamper-Evident Schema)
// ============================================================

const { Pool } = postgres;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For local dev without full URL:
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blocknotice'
});

// Initialize database schema
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notices_chain (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(42),
        timestamp TIMESTAMP DEFAULT NOW(),
        hash VARCHAR(64) NOT NULL UNIQUE,
        previous_hash VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_notices_hash ON notices_chain(hash);
      CREATE INDEX IF NOT EXISTS idx_notices_previous_hash ON notices_chain(previous_hash);
      CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices_chain(created_at DESC);
    `);
    console.log('✓ Database schema ready (tamper-evident table)');
  } catch (err) {
    console.warn('Warning: Could not initialize database:', err.message);
  }
}

// Initialize database on startup
initDatabase();

// ============================================================
// CONTRACT CONFIG (Ethereum Integration)
// ============================================================
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

// ============================================================
// TAMPER-EVIDENT NOTICE ENDPOINTS
// ============================================================

/**
 * GET /api/notices-chain
 * Retrieve all notices from the tamper-evident database
 */
app.get('/api/notices-chain', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, content, author, timestamp, hash, previous_hash, created_at 
       FROM notices_chain 
       ORDER BY created_at ASC`
    );
    res.json({
      success: true,
      count: result.rows.length,
      notices: result.rows
    });
  } catch (err) {
    console.error('Error fetching notices chain:', err.message);
    res.status(500).json({ error: 'Failed to fetch notices chain' });
  }
});

/**
 * GET /api/notices-chain/:id
 * Retrieve a single notice by ID
 */
app.get('/api/notices-chain/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid notice ID' });
  
  try {
    const result = await pool.query(
      `SELECT id, title, content, author, timestamp, hash, previous_hash, created_at 
       FROM notices_chain 
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    res.json({
      success: true,
      notice: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching notice:', err.message);
    res.status(500).json({ error: 'Failed to fetch notice' });
  }
});

/**
 * POST /api/notices-chain
 * Deploy (publish) a new notice to the tamper-evident chain
 * Requires: title, content, author (optional)
 */
app.post('/api/notices-chain', async (req, res) => {
  const { title, content, author } = req.body;
  
  // Validation
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Fetch the last notice in the chain
    const lastNoticeResult = await client.query(
      `SELECT hash FROM notices_chain ORDER BY created_at DESC LIMIT 1`
    );
    const previousHash = lastNoticeResult.rows.length > 0 
      ? lastNoticeResult.rows[0].hash 
      : getGenesisHash();
    
    // 2. Assemble the payload
    const noticeData = {
      title: title.trim(),
      content: content.trim()
    };
    const timestamp = new Date().toISOString();
    
    // 3. Generate the hash
    const hash = calculateHash(noticeData, timestamp, previousHash);
    
    // 4. Save to database (atomic transaction)
    const insertResult = await client.query(
      `INSERT INTO notices_chain (title, content, author, timestamp, hash, previous_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, title, content, author, timestamp, hash, previous_hash, created_at`,
      [
        noticeData.title,
        noticeData.content,
        author || 'system',
        timestamp,
        hash,
        previousHash
      ]
    );
    
    await client.query('COMMIT');
    
    const newNotice = insertResult.rows[0];
    res.status(201).json({
      success: true,
      message: 'Notice deployed to tamper-evident chain',
      notice: newNotice,
      chain_info: {
        total_notices: (await pool.query('SELECT COUNT(*) FROM notices_chain')).rows[0].count,
        chain_hash: hash,
        previous_hash: previousHash
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deploying notice:', err.message);
    res.status(500).json({ error: 'Failed to deploy notice', details: err.message });
  } finally {
    client.release();
  }
});

/**
 * GET /api/chain-verify
 * Verify the integrity of the entire notice chain
 * Returns detailed tampering report if any notice is invalid
 */
app.get('/api/chain-verify', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, content, timestamp, hash, previous_hash 
       FROM notices_chain 
       ORDER BY created_at ASC`
    );
    
    const notices = result.rows;
    const verification = verifyChain(notices);
    
    res.json({
      success: true,
      is_valid: verification.isValid,
      total_notices: notices.length,
      tampering_detected: !verification.isValid,
      tampered_notices: verification.tamperedNotices,
      errors: verification.errors,
      chain_status: verification.isValid ? '✓ CHAIN VERIFIED' : '✗ TAMPERING DETECTED'
    });
  } catch (err) {
    console.error('Error verifying chain:', err.message);
    res.status(500).json({ error: 'Failed to verify chain' });
  }
});

/**
 * GET /api/notice-verify/:id
 * Verify a specific notice in the chain
 * Returns hash verification and link status
 */
app.get('/api/notice-verify/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid notice ID' });
  
  try {
    // Fetch the target notice and the previous notice (if any)
    const noticeResult = await pool.query(
      `SELECT id, title, content, timestamp, hash, previous_hash 
       FROM notices_chain 
       WHERE id = $1`,
      [id]
    );
    
    if (noticeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    const notice = noticeResult.rows[0];
    let expectedPreviousHash = getGenesisHash();
    
    // If not the first notice, fetch the previous one's hash
    if (id > 1) {
      const prevResult = await pool.query(
        `SELECT hash FROM notices_chain WHERE id = $1`,
        [id - 1]
      );
      if (prevResult.rows.length > 0) {
        expectedPreviousHash = prevResult.rows[0].hash;
      }
    }
    
    const verification = verifySingleNotice(notice, expectedPreviousHash);
    
    res.json({
      success: true,
      notice_id: notice.id,
      is_valid: verification.isValid,
      verification_details: verification.details,
      status: verification.isValid ? '✓ VERIFIED' : '✗ TAMPERING DETECTED'
    });
  } catch (err) {
    console.error('Error verifying notice:', err.message);
    res.status(500).json({ error: 'Failed to verify notice' });
  }
});

/**
 * GET /api/chain-status
 * Get high-level status of the notice chain
 */
app.get('/api/chain-status', async (req, res) => {
  try {
    const countResult = await pool.query('SELECT COUNT(*) as count FROM notices_chain');
    const latestResult = await pool.query(
      `SELECT id, title, created_at, hash FROM notices_chain ORDER BY created_at DESC LIMIT 1`
    );
    
    const count = parseInt(countResult.rows[0].count, 10);
    const latest = latestResult.rows.length > 0 ? latestResult.rows[0] : null;
    
    // Quick verification
    const verifyResult = await pool.query(
      `SELECT id, title, content, timestamp, hash, previous_hash 
       FROM notices_chain 
       ORDER BY created_at ASC`
    );
    const verification = verifyChain(verifyResult.rows);
    
    res.json({
      success: true,
      chain_length: count,
      is_intact: verification.isValid,
      latest_notice: latest,
      genesis_hash: getGenesisHash(),
      chain_health: verification.isValid ? 'healthy' : 'compromised'
    });
  } catch (err) {
    console.error('Error getting chain status:', err.message);
    res.status(500).json({ error: 'Failed to get chain status' });
  }
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
