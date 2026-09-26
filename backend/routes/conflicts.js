const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// GET /api/conflicts - List all conflicts
router.get('/', (req, res) => {
  try {
    const conflicts = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM chat_messages WHERE conflict_id = c.id) as message_count,
        (SELECT id FROM mediations WHERE conflict_id = c.id LIMIT 1) as mediation_id
      FROM conflicts c
      ORDER BY c.created_at DESC
    `).all();

    res.json(conflicts);
  } catch (err) {
    console.error('Error fetching conflicts:', err);
    res.status(500).json({ error: 'Failed to retrieve conflicts' });
  }
});

// POST /api/conflicts - Create a new conflict
router.post('/', (req, res) => {
  const { title, category, created_by_role, description, parent_perspective, teen_perspective } = req.body;

  if (!title || !category || !created_by_role) {
    return res.status(400).json({ error: 'Title, category, and role are required' });
  }

  const id = 'c_' + Date.now();

  try {
    const stmt = db.prepare(`
      INSERT INTO conflicts (id, title, category, status, created_by_role, description, parent_perspective, teen_perspective)
      VALUES (?, ?, ?, 'open', ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      title,
      category,
      created_by_role,
      description || '',
      parent_perspective || '',
      teen_perspective || ''
    );

    const created = db.prepare('SELECT * FROM conflicts WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating conflict:', err);
    res.status(500).json({ error: 'Failed to create conflict' });
  }
});

// GET /api/conflicts/:id - Get conflict by ID
router.get('/:id', (req, res) => {
  try {
    const conflict = db.prepare('SELECT * FROM conflicts WHERE id = ?').get(req.params.id);
    if (!conflict) {
      return res.status(400).json({ error: 'Conflict not found' });
    }

    const mediation = db.prepare('SELECT * FROM mediations WHERE conflict_id = ?').get(req.params.id);
    const messages = db.prepare('SELECT * FROM chat_messages WHERE conflict_id = ? ORDER BY created_at ASC').all(req.params.id);
    const agreement = db.prepare('SELECT * FROM agreements WHERE conflict_id = ?').get(req.params.id);

    res.json({
      ...conflict,
      mediation: mediation ? {
        ...mediation,
        parent_underlying_needs: JSON.parse(mediation.parent_underlying_needs || '[]'),
        teen_underlying_needs: JSON.parse(mediation.teen_underlying_needs || '[]'),
        common_ground: JSON.parse(mediation.common_ground || '[]'),
        parent_commitments: JSON.parse(mediation.parent_commitments || '[]'),
        teen_commitments: JSON.parse(mediation.teen_commitments || '[]')
      } : null,
      messages,
      agreement
    });
  } catch (err) {
    console.error('Error fetching conflict detail:', err);
    res.status(500).json({ error: 'Failed to retrieve conflict detail' });
  }
});

// PUT /api/conflicts/:id/perspective - Add/update perspective
router.put('/:id/perspective', (req, res) => {
  const { role, perspective } = req.body;
  if (!role || perspective === undefined) {
    return res.status(400).json({ error: 'Role and perspective are required' });
  }

  const column = role === 'parent' ? 'parent_perspective' : 'teen_perspective';

  try {
    db.prepare(`
      UPDATE conflicts 
      SET ${column} = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(perspective, req.params.id);

    const updated = db.prepare('SELECT * FROM conflicts WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating perspective:', err);
    res.status(500).json({ error: 'Failed to update perspective' });
  }
});

// PUT /api/conflicts/:id/status - Update conflict status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  try {
    db.prepare(`
      UPDATE conflicts 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(status, req.params.id);

    const updated = db.prepare('SELECT * FROM conflicts WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE /api/conflicts/:id
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM chat_messages WHERE conflict_id = ?').run(req.params.id);
    db.prepare('DELETE FROM mediations WHERE conflict_id = ?').run(req.params.id);
    db.prepare('DELETE FROM agreements WHERE conflict_id = ?').run(req.params.id);
    db.prepare('DELETE FROM conflicts WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Conflict deleted' });
  } catch (err) {
    console.error('Error deleting conflict:', err);
    res.status(500).json({ error: 'Failed to delete conflict' });
  }
});

module.exports = router;
