const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// GET /api/agreements - List all agreements
router.get('/', (req, res) => {
  try {
    const agreements = db.prepare(`
      SELECT a.*, c.title as conflict_title 
      FROM agreements a
      LEFT JOIN conflicts c ON a.conflict_id = c.id
      ORDER BY a.created_at DESC
    `).all();

    res.json(agreements);
  } catch (err) {
    console.error('Error fetching agreements:', err);
    res.status(500).json({ error: 'Failed to retrieve agreements' });
  }
});

// POST /api/agreements - Create an agreement from conflict or custom
router.post('/', (req, res) => {
  const { conflict_id, title, parent_pledge, teen_pledge, safety_boundary, reward_or_privilege, check_in_date } = req.body;

  if (!title || !parent_pledge || !teen_pledge) {
    return res.status(400).json({ error: 'Title, parent_pledge, and teen_pledge are required' });
  }

  const id = 'ag_' + Date.now();

  try {
    db.prepare(`
      INSERT INTO agreements (id, conflict_id, title, parent_pledge, teen_pledge, safety_boundary, reward_or_privilege, check_in_date, status, parent_signed, teen_signed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, 0)
    `).run(
      id,
      conflict_id || null,
      title,
      parent_pledge,
      teen_pledge,
      safety_boundary || '',
      reward_or_privilege || '',
      check_in_date || '2 Weeks'
    );

    // If linked to conflict, mark conflict resolved or in_mediation
    if (conflict_id) {
      db.prepare("UPDATE conflicts SET status = 'resolved', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(conflict_id);
    }

    const created = db.prepare('SELECT * FROM agreements WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating agreement:', err);
    res.status(500).json({ error: 'Failed to create agreement' });
  }
});

// PUT /api/agreements/:id/sign - Sign agreement as parent or teen
router.put('/:id/sign', (req, res) => {
  const { role } = req.body;
  if (!role || (role !== 'parent' && role !== 'teen')) {
    return res.status(400).json({ error: 'Role must be "parent" or "teen"' });
  }

  const col = role === 'parent' ? 'parent_signed' : 'teen_signed';

  try {
    db.prepare(`UPDATE agreements SET ${col} = 1 WHERE id = ?`).run(req.params.id);
    const updated = db.prepare('SELECT * FROM agreements WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Error signing agreement:', err);
    res.status(500).json({ error: 'Failed to sign agreement' });
  }
});

// PUT /api/agreements/:id/status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  try {
    db.prepare('UPDATE agreements SET status = ? WHERE id = ?').run(status, req.params.id);
    const updated = db.prepare('SELECT * FROM agreements WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Error updating agreement status:', err);
    res.status(500).json({ error: 'Failed to update agreement status' });
  }
});

module.exports = router;
