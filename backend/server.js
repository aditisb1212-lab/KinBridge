const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Initialize database
const { initDb } = require('./db/database');
initDb();

// Routes
const conflictsRoutes = require('./routes/conflicts');
const mediationRoutes = require('./routes/mediation');
const chatRoutes = require('./routes/chat');
const translatorRoutes = require('./routes/translator');
const agreementsRoutes = require('./routes/agreements');
const checkinsRoutes = require('./routes/checkins');
const insightsRoutes = require('./routes/insights');
const scenariosRoutes = require('./routes/scenarios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API endpoints
app.use('/api/conflicts', conflictsRoutes);
app.use('/api/mediation', mediationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/translator', translatorRoutes);
app.use('/api/agreements', agreementsRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/scenarios', scenariosRoutes);

// Health check & system status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'KinBridge Parent-Teen Grounded AI',
    nodeVersion: process.version,
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    timestamp: new Date().toISOString()
  });
});

// Serve frontend: check frontend/dist
const candidateFrontendDist = [
  path.join(__dirname, '..', 'frontend', 'dist'),
  path.join(__dirname, 'frontend', 'dist')
];
const frontendDistPath = candidateFrontendDist.find(p => fs.existsSync(p));

if (frontendDistPath) {
  app.use(express.static(frontendDistPath));
  // Express 5 compatible SPA fallback middleware
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
    next();
  });
}

const server = app.listen(PORT, () => {
  console.log(`KinBridge Server running at: http://localhost:${PORT}`);
  console.log(`Node Environment: ${process.version} (Native SQLite ready)`);
});

module.exports = { app, server };
