import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import pool from './db.js';
import authRoutes from './routes/auth.js';
import noticesRoutes from './routes/notices.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '../frontend/dist');
const UPLOADS = join(__dirname, 'uploads');

if (!existsSync(UPLOADS)) mkdirSync(UPLOADS, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notices', noticesRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Serve built frontend in production
app.use('/uploads', express.static(UPLOADS));

if (existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (_, res) => res.sendFile(join(DIST, 'index.html')));
}

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

    CREATE TABLE IF NOT EXISTS notice_attachments (
      id SERIAL PRIMARY KEY,
      notice_id INTEGER NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      mimetype VARCHAR(100) NOT NULL,
      size INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_attachments_notice ON notice_attachments(notice_id);
  `);
  console.log('✓ Database ready');
}

const PORT = process.env.PORT || process.env.BACKEND_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Backend running on port ${PORT}`);
  initDb().catch(console.error);
});
