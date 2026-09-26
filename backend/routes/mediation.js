const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { mediateConflict } = require('../services/aiService');

// POST /api/mediation/:conflictId - Run AI mediation on conflict
router.post('/:conflictId', async (req, res) => {
  const { conflictId } = req.params;

  try {
    const conflict = db.prepare('SELECT * FROM conflicts WHERE id = ?').get(conflictId);
    if (!conflict) {
      return res.status(404).json({ error: 'Conflict not found' });
    }

    // Call AI mediation engine
    const result = await mediateConflict({
      title: conflict.title,
      category: conflict.category,
      parentPerspective: conflict.parent_perspective,
      teenPerspective: conflict.teen_perspective,
      description: conflict.description
    });

    // Check if mediation record exists
    const existing = db.prepare('SELECT id FROM mediations WHERE conflict_id = ?').get(conflictId);
    const mediationId = existing ? existing.id : 'm_' + Date.now();

    if (existing) {
      db.prepare(`
        UPDATE mediations
        SET summary = ?, parent_underlying_needs = ?, teen_underlying_needs = ?, 
            common_ground = ?, grounded_decision = ?, parent_commitments = ?, 
            teen_commitments = ?, review_period = ?, positive_reinforcement_note = ?
        WHERE id = ?
      `).run(
        result.summary,
        JSON.stringify(result.parentUnderlyingNeeds || []),
        JSON.stringify(result.teenUnderlyingNeeds || []),
        JSON.stringify(result.commonGround || []),
        result.groundedDecision,
        JSON.stringify(result.parentCommitments || []),
        JSON.stringify(result.teenCommitments || []),
        result.reviewPeriod || '2 Weeks',
        result.positiveReinforcementNote || '',
        mediationId
      );
    } else {
      db.prepare(`
        INSERT INTO mediations (id, conflict_id, summary, parent_underlying_needs, teen_underlying_needs, common_ground, grounded_decision, parent_commitments, teen_commitments, review_period, positive_reinforcement_note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        mediationId,
        conflictId,
        result.summary,
        JSON.stringify(result.parentUnderlyingNeeds || []),
        JSON.stringify(result.teenUnderlyingNeeds || []),
        JSON.stringify(result.commonGround || []),
        result.groundedDecision,
        JSON.stringify(result.parentCommitments || []),
        JSON.stringify(result.teenCommitments || []),
        result.reviewPeriod || '2 Weeks',
        result.positiveReinforcementNote || ''
      );
    }

    // Update conflict status to 'in_mediation'
    db.prepare("UPDATE conflicts SET status = 'in_mediation', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(conflictId);

    // Return populated mediation object
    res.json({
      id: mediationId,
      conflict_id: conflictId,
      summary: result.summary,
      parent_underlying_needs: result.parentUnderlyingNeeds,
      teen_underlying_needs: result.teenUnderlyingNeeds,
      common_ground: result.commonGround,
      grounded_decision: result.groundedDecision,
      parent_commitments: result.parentCommitments,
      teen_commitments: result.teenCommitments,
      review_period: result.reviewPeriod,
      positive_reinforcement_note: result.positiveReinforcementNote
    });
  } catch (err) {
    console.error('Error generating mediation:', err);
    res.status(500).json({ error: 'Failed to generate mediation' });
  }
});

// GET /api/mediation/:conflictId - Get existing mediation
router.get('/:conflictId', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM mediations WHERE conflict_id = ?').get(req.params.conflictId);
    if (!row) {
      return res.status(404).json({ error: 'No mediation found for this conflict yet' });
    }

    res.json({
      ...row,
      parent_underlying_needs: JSON.parse(row.parent_underlying_needs || '[]'),
      teen_underlying_needs: JSON.parse(row.teen_underlying_needs || '[]'),
      common_ground: JSON.parse(row.common_ground || '[]'),
      parent_commitments: JSON.parse(row.parent_commitments || '[]'),
      teen_commitments: JSON.parse(row.teen_commitments || '[]')
    });
  } catch (err) {
    console.error('Error fetching mediation:', err);
    res.status(500).json({ error: 'Failed to retrieve mediation' });
  }
});

module.exports = router;
