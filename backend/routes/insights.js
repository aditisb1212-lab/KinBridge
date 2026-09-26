const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { generateFamilyInsights } = require('../services/aiService');

// GET /api/insights - Retrieve family pattern analysis
router.get('/', async (req, res) => {
  try {
    const conflicts = db.prepare('SELECT id, title, category, status, description FROM conflicts').all();
    const checkins = db.prepare('SELECT role, mood_score, stress_level, feeling_heard_score, note FROM checkins ORDER BY created_at DESC LIMIT 10').all();
    const agreements = db.prepare('SELECT id, title, status FROM agreements').all();

    // Category breakdown
    const categoryCounts = {};
    for (const c of conflicts) {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    }

    const aiInsights = await generateFamilyInsights(conflicts, checkins);

    res.json({
      stats: {
        totalConflicts: conflicts.length,
        resolvedConflicts: conflicts.filter(c => c.status === 'resolved').length,
        inMediation: conflicts.filter(c => c.status === 'in_mediation').length,
        openConflicts: conflicts.filter(c => c.status === 'open').length,
        activeAgreements: agreements.filter(a => a.status === 'active').length,
        categoryCounts
      },
      insights: aiInsights
    });
  } catch (err) {
    console.error('Error generating family insights:', err);
    res.status(500).json({ error: 'Failed to retrieve insights' });
  }
});

module.exports = router;
