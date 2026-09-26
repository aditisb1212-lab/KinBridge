const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

const PRESET_SCENARIOS = [
  {
    title: 'Car Privileges & Independent Driving Rules',
    category: 'Curfew & Social Life',
    created_by_role: 'teen',
    description: 'Leo got his provisional license and wants to drive friends to the regional debate tournament 45 minutes away.',
    parent_perspective: 'Statistically, fatal accidents spike when teens carry multiple teenage passengers. I want him to drive solo for 6 months before transporting friends on highways.',
    teen_perspective: 'I took all driving lessons, passed on my first attempt, and driving our team saves parents hours of carpooling. Treating me like I will crash immediately is demoralizing.'
  },
  {
    title: 'Video Gaming on Weeknights vs Study Focus',
    category: 'Screen Time & Tech',
    created_by_role: 'parent',
    description: 'Discord and multiplayer gaming during school weeknights until 11 PM.',
    parent_perspective: 'His grades dropped from an A to a B in Chemistry. I see Discord notifications pinging constantly while he is supposedly studying at his desk.',
    teen_perspective: 'Gaming with my friend group is how we decompress after 8 hours of intense school pressure. It is my main social outlet, not an addiction.'
  },
  {
    title: 'Room Cleanliness & Personal Privacy Space',
    category: 'Privacy & Trust',
    created_by_role: 'parent',
    description: 'Closed door policy and clutter in bedroom.',
    parent_perspective: 'Dirty laundry, plates with food residue attract pests and show disrespect for the home. Leaving the door closed all day feels like shutting the family out.',
    teen_perspective: 'My room is my one sanctuary in the world where nobody is telling me what to do. As long as there are no plates, whether clothes are folded should be my business.'
  }
];

// GET /api/scenarios - List presets
router.get('/', (req, res) => {
  res.json(PRESET_SCENARIOS);
});

// POST /api/scenarios/import - Import a preset scenario into active conflicts
router.post('/import', (req, res) => {
  const { index } = req.body;
  const scenario = PRESET_SCENARIOS[index !== undefined ? index : 0];
  if (!scenario) {
    return res.status(404).json({ error: 'Scenario preset not found' });
  }

  const id = 'c_scen_' + Date.now();
  try {
    db.prepare(`
      INSERT INTO conflicts (id, title, category, status, created_by_role, description, parent_perspective, teen_perspective)
      VALUES (?, ?, ?, 'open', ?, ?, ?, ?)
    `).run(
      id,
      scenario.title,
      scenario.category,
      scenario.created_by_role,
      scenario.description,
      scenario.parent_perspective,
      scenario.teen_perspective
    );

    const created = db.prepare('SELECT * FROM conflicts WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error importing scenario:', err);
    res.status(500).json({ error: 'Failed to import scenario' });
  }
});

module.exports = router;
