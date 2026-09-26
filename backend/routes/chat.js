const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { generateMediatorReply } = require('../services/aiService');

// GET /api/chat/:conflictId - Get chat messages
router.get('/:conflictId', (req, res) => {
  try {
    const messages = db.prepare(`
      SELECT * FROM chat_messages 
      WHERE conflict_id = ? 
      ORDER BY created_at ASC
    `).all(req.params.conflictId);

    res.json(messages);
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// POST /api/chat/:conflictId - Send message from Parent or Teen
router.post('/:conflictId', async (req, res) => {
  const { conflictId } = req.params;
  const { sender_role, sender_name, message, trigger_mediator } = req.body;

  if (!sender_role || !message) {
    return res.status(400).json({ error: 'Sender role and message are required' });
  }

  const msgId = 'msg_' + Date.now();
  const name = sender_name || (sender_role === 'parent' ? 'Parent' : 'Teen');

  try {
    // 1. Insert user message
    db.prepare(`
      INSERT INTO chat_messages (id, conflict_id, sender_role, sender_name, message, tone_label)
      VALUES (?, ?, ?, ?, ?, 'constructive')
    `).run(msgId, conflictId, sender_role, name, message);

    const userMsg = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(msgId);

    let mediatorMsg = null;

    // 2. If trigger_mediator is true (default true), generate AI mediator intervention
    if (trigger_mediator !== false) {
      const conflict = db.prepare('SELECT title FROM conflicts WHERE id = ?').get(conflictId);
      const history = db.prepare(`
        SELECT sender_role, sender_name, message 
        FROM chat_messages 
        WHERE conflict_id = ? 
        ORDER BY created_at ASC
      `).all(conflictId);

      const mediatorReply = await generateMediatorReply({
        conflictTitle: conflict ? conflict.title : 'Family Communication',
        conversationHistory: history,
        newSpeakerRole: sender_role,
        newMessage: message
      });

      const mediatorMsgId = 'msg_ai_' + (Date.now() + 1);
      db.prepare(`
        INSERT INTO chat_messages (id, conflict_id, sender_role, sender_name, message, tone_label)
        VALUES (?, ?, 'ai_mediator', 'KinBridge AI', ?, 'grounded_solution')
      `).run(mediatorMsgId, conflictId, mediatorReply);

      mediatorMsg = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(mediatorMsgId);
    }

    res.status(201).json({
      userMessage: userMsg,
      mediatorMessage: mediatorMsg
    });
  } catch (err) {
    console.error('Error posting chat message:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// POST /api/chat/:conflictId/step-in - Force AI mediator to step in with grounding summary
router.post('/:conflictId/step-in', async (req, res) => {
  const { conflictId } = req.params;

  try {
    const conflict = db.prepare('SELECT title FROM conflicts WHERE id = ?').get(conflictId);
    const history = db.prepare(`
      SELECT sender_role, sender_name, message 
      FROM chat_messages 
      WHERE conflict_id = ? 
      ORDER BY created_at ASC
    `).all(conflictId);

    const mediatorReply = await generateMediatorReply({
      conflictTitle: conflict ? conflict.title : 'Family Discussion',
      conversationHistory: history,
      newSpeakerRole: 'family',
      newMessage: 'Please step in and provide a calming summary of where we stand and propose our next grounded compromise step.'
    });

    const mediatorMsgId = 'msg_ai_' + Date.now();
    db.prepare(`
      INSERT INTO chat_messages (id, conflict_id, sender_role, sender_name, message, tone_label)
      VALUES (?, ?, 'ai_mediator', 'KinBridge AI', ?, 'grounded_solution')
    `).run(mediatorMsgId, conflictId, mediatorReply);

    const mediatorMsg = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(mediatorMsgId);
    res.status(201).json(mediatorMsg);
  } catch (err) {
    console.error('Error with mediator step-in:', err);
    res.status(500).json({ error: 'Failed to generate mediator step-in' });
  }
});

module.exports = router;
