import express from 'express';
import pool from '../db.js';

const router = express.Router();

function isFaculty(req) {
  const address = req.headers['x-wallet-address']?.toLowerCase();
  const faculty  = process.env.ADMIN_WALLET_ADDRESS?.toLowerCase();
  return address && faculty && address === faculty;
}

// GET /api/notices — public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, content, published_by, created_at FROM notices ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch notices error:', err.message);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// POST /api/notices — faculty only
router.post('/', async (req, res) => {
  if (!isFaculty(req)) {
    return res.status(403).json({ error: 'Faculty access required' });
  }
  const { title, content } = req.body;
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO notices (title, content, published_by) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), content.trim(), req.headers['x-wallet-address']]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Publish error:', err.message);
    res.status(500).json({ error: 'Failed to publish notice' });
  }
});

// DELETE /api/notices/:id — faculty only
router.delete('/:id', async (req, res) => {
  if (!isFaculty(req)) {
    return res.status(403).json({ error: 'Faculty access required' });
  }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid notice ID' });
  try {
    await pool.query('DELETE FROM notices WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

export default router;
