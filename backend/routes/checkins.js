const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// GET /api/checkins - Get recent check-ins
router.get('/', (req, res) => {
  try {
    const checkins = db.prepare(`
      SELECT * FROM checkins 
      ORDER BY created_at DESC 
      LIMIT 20
    `).all();

    res.json(checkins);
  } catch (err) {
    console.error('Error fetching checkins:', err);
    res.status(500).json({ error: 'Failed to retrieve checkins' });
  }
});

// POST /api/checkins - Log a check-in
router.post('/', (req, res) => {
  const { role, mood_score, stress_level, feeling_heard_score, note } = req.body;

  if (!role || mood_score === undefined || stress_level === undefined || feeling_heard_score === undefined) {
    return res.status(400).json({ error: 'Role, mood_score, stress_level, and feeling_heard_score are required' });
  }

  const id = 'ck_' + Date.now();

  try {
    db.prepare(`
      INSERT INTO checkins (id, role, mood_score, stress_level, feeling_heard_score, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      role,
      Number(mood_score),
      Number(stress_level),
      Number(feeling_heard_score),
      note || ''
    );

    const created = db.prepare('SELECT * FROM checkins WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating checkin:', err);
    res.status(500).json({ error: 'Failed to record checkin' });
  }
});

module.exports = router;
