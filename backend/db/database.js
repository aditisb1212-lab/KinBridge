const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'kinbridge.sqlite');
const db = new DatabaseSync(dbPath);

// Initialize Tables
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conflicts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_by_role TEXT NOT NULL,
      description TEXT,
      parent_perspective TEXT,
      teen_perspective TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mediations (
      id TEXT PRIMARY KEY,
      conflict_id TEXT NOT NULL,
      summary TEXT,
      parent_underlying_needs TEXT,
      teen_underlying_needs TEXT,
      common_ground TEXT,
      grounded_decision TEXT,
      parent_commitments TEXT,
      teen_commitments TEXT,
      review_period TEXT,
      positive_reinforcement_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(conflict_id) REFERENCES conflicts(id)
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conflict_id TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      message TEXT NOT NULL,
      tone_label TEXT DEFAULT 'constructive',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(conflict_id) REFERENCES conflicts(id)
    );

    CREATE TABLE IF NOT EXISTS agreements (
      id TEXT PRIMARY KEY,
      conflict_id TEXT,
      title TEXT NOT NULL,
      parent_pledge TEXT NOT NULL,
      teen_pledge TEXT NOT NULL,
      safety_boundary TEXT,
      reward_or_privilege TEXT,
      check_in_date TEXT,
      status TEXT DEFAULT 'active',
      parent_signed INTEGER DEFAULT 0,
      teen_signed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      mood_score INTEGER NOT NULL,
      stress_level INTEGER NOT NULL,
      feeling_heard_score INTEGER NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if users exist
  const existingUser = db.prepare('SELECT id FROM users LIMIT 1').get();
  if (existingUser) return; // already seeded

  // Seed default Users
  const insertUser = db.prepare('INSERT INTO users (id, name, role, avatar, bio) VALUES (?, ?, ?, ?, ?)');
  insertUser.run('parent_1', 'Sarah (Mom)', 'parent', '👩', 'Cares deeply about safety, health, future readiness, and staying connected.');
  insertUser.run('teen_1', 'Leo (16 yrs)', 'teen', '🎧', 'High school sophomore who loves design, gaming with friends, and wants more independence.');

  // Seed default conflicts
  const insertConflict = db.prepare(`
    INSERT INTO conflicts (id, title, category, status, created_by_role, description, parent_perspective, teen_perspective, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-2 days'))
  `);

  insertConflict.run(
    'c_curfew',
    'Weekend Curfew & Hanging Out After 10 PM',
    'Curfew & Social Life',
    'in_mediation',
    'teen',
    'Leo wants curfew extended from 10:00 PM to 11:30 PM on Friday nights when with his debate team friends.',
    'I worry about teen drivers late at night and getting enough sleep. I don’t want to be waking up in panic wondering where he is.',
    'All my friends stay out until 11:30 PM to grab burgers after games. Leaving at 10 PM makes me feel like a child and I miss out.'
  );

  insertConflict.run(
    'c_screentime',
    'Phone in Bedroom at Bedtime & Night Privacy',
    'Privacy & Trust',
    'open',
    'parent',
    'Sarah wants all devices plugged in the kitchen docking station by 10:30 PM on school nights.',
    'Screens ruin melatonin, keep teens scrolling TikTok until 2 AM, and cause exhaustion before exams. It is purely about healthy sleep habits.',
    'My phone has my alarm, calming music, and group chats for study help. Being forced to hand it over feels like punishment and distrust.'
  );

  insertConflict.run(
    'c_career',
    'Digital Media & Game Design vs. Pre-Med Path',
    'Academics & Future',
    'resolved',
    'parent',
    'Debate over summer programs: medical internship vs. digital UX & game design camp.',
    'Medicine offers lifelong security, stable income, and immense societal respect. I want him to have financial stability.',
    'I love digital art and user interface design. Forcing me into biology when I hate it will make me miserable and burnt out.'
  );

  // Seed default mediation for c_career
  const insertMediation = db.prepare(`
    INSERT INTO mediations (id, conflict_id, summary, parent_underlying_needs, teen_underlying_needs, common_ground, grounded_decision, parent_commitments, teen_commitments, review_period, positive_reinforcement_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMediation.run(
    'm_career',
    'c_career',
    'Both Sarah and Leo want Leo to have a thriving, financially stable, and fulfilling future. The tension stems from different definitions of safety vs passion.',
    JSON.stringify(['Financial security', 'Protecting Leo from career instability', 'Knowing he has marketable high-demand skills']),
    JSON.stringify(['Creative autonomy', 'Studying subjects aligned with intrinsic motivation', 'Being trusted with personal identity']),
    JSON.stringify(['Focus on high-growth fields with practical earnings', 'Commitment to academic diligence', 'Strong portfolio development']),
    'Grounded Dual-Track Agreement: Leo enrolls in the Summer UX/UI & Interactive Media Accelerator while maintaining an honors GPA in Math & Science. Sarah supports his creative direction; Leo agrees to research tech-industry salaries, create a real portfolio, and explore lucrative fields like UI/UX Architecture and Product Design.',
    JSON.stringify(['Fund the summer UX design bootcamp without resentment', 'Refrain from passive-aggressive comments about medical school', 'Help Leo connect with tech industry mentors']),
    JSON.stringify(['Maintain a minimum 3.6 GPA in core academic classes', 'Build 2 completed portfolio projects to show career viability', 'Attend a bi-weekly dinner to update parents on his progress']),
    '3 Months (End of Summer)',
    'Sarah showed tremendous love by respecting Leo’s individuality, and Leo demonstrated mature accountability by committing to academic excellence!'
  );

  // Seed chat messages for c_curfew
  const insertMsg = db.prepare(`
    INSERT INTO chat_messages (id, conflict_id, sender_role, sender_name, message, tone_label, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);

  insertMsg.run('m1', 'c_curfew', 'teen', 'Leo', 'Mom, can we talk about Friday nights? Leaving at 10 PM cuts off dinner with the team.', 'vulnerable', '-2 hours');
  insertMsg.run('m2', 'c_curfew', 'parent', 'Sarah', 'Leo, nothing good happens after 10 PM for teenagers on the road. I can’t sleep until I hear the front door lock.', 'vulnerable', '-1 hour');
  insertMsg.run('m3', 'c_curfew', 'ai_mediator', 'KinBridge AI', 'Notice the shared care here: Sarah’s reaction is fueled by deep maternal protection and anxiety for Leo’s physical safety, not a desire to isolate him. Leo’s request is about healthy social bonding and feeling trusted as he matures. Can we explore a stepped curfew with safety check-ins?', 'grounded_solution', '-30 minutes');

  // Seed sample agreement
  const insertAgreement = db.prepare(`
    INSERT INTO agreements (id, conflict_id, title, parent_pledge, teen_pledge, safety_boundary, reward_or_privilege, check_in_date, status, parent_signed, teen_signed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAgreement.run(
    'ag_curfew',
    'c_curfew',
    'Friday Night Stepped Independence Trial',
    'I agree to extend Friday curfew to 11:00 PM for the next 4 weeks and will not send repeated texts while you are with friends.',
    'I will text a quick location pin at 10:00 PM and 10:45 PM, drive safely with seatbelts, and never ride with an impaired driver.',
    'Must be home by 11:00 PM sharp. If delayed, text at least 20 minutes prior.',
    'If honored for 4 consecutive weeks, curfew moves to 11:30 PM for team celebrations.',
    'In 4 Weeks',
    'active',
    1,
    1
  );

  // Seed sample checkins
  const insertCheckin = db.prepare(`
    INSERT INTO checkins (id, role, mood_score, stress_level, feeling_heard_score, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);

  insertCheckin.run('ck_1', 'parent', 4, 3, 4, 'Felt relieved after our talk about tech careers. Appreciated Leo sharing his designs.', '-1 day');
  insertCheckin.run('ck_2', 'teen', 5, 2, 5, 'Mom actually listened to why I like UX design instead of immediately saying doctor or engineer.', '-1 day');
}

initDb();

module.exports = {
  db,
  initDb
};
