import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import authRoutes from './routes/auth.js';
import noticesRoutes from './routes/notices.js';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notices', noticesRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notices (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      published_by VARCHAR(42) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_notices_created ON notices(created_at DESC);
  `);
  console.log('✓ Database ready');
}

const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Backend running on port ${PORT}`);
  initDb().catch(console.error);
});
