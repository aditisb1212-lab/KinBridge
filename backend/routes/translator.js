const express = require('express');
const router = express.Router();
const { translatePerspective } = require('../services/aiService');

// POST /api/translator - Translate raw emotional thought into constructive communication
router.post('/', async (req, res) => {
  const { rawThought, speakerRole, recipientRole } = req.body;

  if (!rawThought || !speakerRole) {
    return res.status(400).json({ error: 'rawThought and speakerRole are required' });
  }

  try {
    const targetRecipient = recipientRole || (speakerRole === 'parent' ? 'teen' : 'parent');
    const result = await translatePerspective({
      rawThought,
      speakerRole,
      recipientRole: targetRecipient
    });

    res.json(result);
  } catch (err) {
    console.error('Error translating perspective:', err);
    res.status(500).json({ error: 'Failed to translate perspective' });
  }
});

module.exports = router;
