import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { randomUUID } from 'crypto';
import pool from '../db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS = join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS),
  filename: (_, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = express.Router();

function isFaculty(req) {
  const address = req.headers['x-wallet-address']?.toLowerCase();
  const faculty  = process.env.ADMIN_WALLET_ADDRESS?.toLowerCase();
  return address && faculty && address === faculty;
}

// GET /api/notices — public, includes attachments
router.get('/', async (req, res) => {
  try {
    const notices = await pool.query(
      'SELECT id, title, content, published_by, created_at FROM notices ORDER BY created_at DESC'
    );
    const attachments = await pool.query(
      'SELECT id, notice_id, filename, original_name, mimetype, size FROM notice_attachments ORDER BY id ASC'
    );
    const attachMap = {};
    for (const a of attachments.rows) {
      if (!attachMap[a.notice_id]) attachMap[a.notice_id] = [];
      attachMap[a.notice_id].push(a);
    }
    const result = notices.rows.map((n) => ({
      ...n,
      attachments: attachMap[n.id] || [],
    }));
    res.json(result);
  } catch (err) {
    console.error('Fetch notices error:', err.message);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// POST /api/notices — faculty only, supports multipart file uploads
router.post('/', upload.array('files', 5), async (req, res) => {
  if (!isFaculty(req)) {
    if (req.files?.length) {
      for (const f of req.files) {
        unlink(f.path).catch(() => {});
      }
    }
    return res.status(403).json({ error: 'Faculty access required' });
  }

  const { title, content } = req.body;
  if (!title?.trim() || !content?.trim()) {
    if (req.files?.length) {
      for (const f of req.files) {
        unlink(f.path).catch(() => {});
      }
    }
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const noticeResult = await client.query(
      'INSERT INTO notices (title, content, published_by) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), content.trim(), req.headers['x-wallet-address']]
    );
    const notice = noticeResult.rows[0];

    const attachments = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const r = await client.query(
          `INSERT INTO notice_attachments (notice_id, filename, original_name, mimetype, size)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [notice.id, file.filename, file.originalname, file.mimetype, file.size]
        );
        attachments.push(r.rows[0]);
      }
    }
    await client.query('COMMIT');
    res.status(201).json({ ...notice, attachments });
  } catch (err) {
    await client.query('ROLLBACK');
    if (req.files?.length) {
      for (const f of req.files) {
        unlink(f.path).catch(() => {});
      }
    }
    console.error('Publish error:', err.message);
    res.status(500).json({ error: 'Failed to publish notice' });
  } finally {
    client.release();
  }
});

// DELETE /api/notices/:id — faculty only, also removes attachment files
router.delete('/:id', async (req, res) => {
  if (!isFaculty(req)) {
    return res.status(403).json({ error: 'Faculty access required' });
  }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid notice ID' });

  try {
    const files = await pool.query(
      'SELECT filename FROM notice_attachments WHERE notice_id = $1', [id]
    );
    await pool.query('DELETE FROM notices WHERE id = $1', [id]);
    for (const { filename } of files.rows) {
      const filePath = join(UPLOADS, filename);
      if (existsSync(filePath)) unlink(filePath).catch(() => {});
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

export default router;
