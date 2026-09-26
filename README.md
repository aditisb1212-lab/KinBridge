# 🤝 KinBridge — Grounded Parent & Teen AI Mediator

> **Full-Stack Application structured into clean `frontend/` and `backend/` folders.**
> Built with React.js, Express.js, Node.js (Node 24+), Native SQLite (`node:sqlite`), and Google Gemini AI.

---

## 📁 Two-Folder Clean Architecture

```text
kinbridge/
├── backend/                  # 🛡️ Express.js & Node 24 Backend
│   ├── server.js             # API server & SPA static host
│   ├── package.json          # Backend dependencies (Express 5, @google/genai, cors)
│   ├── .env.example          # Environment template (PORT, GEMINI_API_KEY)
│   ├── db/
│   │   ├── database.js       # Native Node 24 SQLite (DatabaseSync) layer & schema
│   │   └── kinbridge.sqlite  # SQLite database file (auto-generated)
│   ├── routes/
│   │   ├── conflicts.js      # Dilemmas CRUD & dual-perspective endpoints
│   │   ├── mediation.js      # Grounded AI Mediation engine endpoint
│   │   ├── chat.js           # 3-way conversational mediation room
│   │   ├── translator.js     # Perspective & tone translator
│   │   ├── agreements.js     # Signed family contracts & pacts
│   │   ├── checkins.js       # 30-sec daily mood & connection pulse
│   │   ├── insights.js       # Pattern recognition & harmony analytics
│   │   └── scenarios.js      # Preloaded realistic conflict presets
│   └── services/
│       └── aiService.js      # Gemini 3.8 Flash + resilient psychological fallback
│
├── frontend/                 # 🎧 React.js Client (Vite)
│   ├── package.json          # React 19, Vite, Lucide-react
│   ├── vite.config.js        # Vite config with backend proxy
│   ├── index.html            # HTML shell with Google Plus Jakarta Sans font
│   ├── dist/                 # Production-ready compiled assets (served by Express)
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Master UI state, role & tab coordinator
│       ├── index.css         # Custom responsive glassmorphism theme
│       └── components/
│           ├── Navbar.jsx               # Role switcher (Parent, Teen, Hub)
│           ├── ConflictList.jsx         # Dilemma overview & category filters
│           ├── ConflictDetail.jsx       # Dual-perspective & AI mediation engine view
│           ├── MediationRoom.jsx        # Live 3-way conversational chat room
│           ├── PerspectiveTranslator.jsx# Raw-thought emotional de-escalator
│           ├── AgreementContract.jsx    # Printable/signable family pacts
│           ├── MoodPulse.jsx            # Daily sentiment & stress tracker
│           ├── PatternInsights.jsx      # Harmony index (0–100%) & guidance radar
│           └── NewConflictModal.jsx     # Raise dilemma / load presets modal
│
├── package.json              # ⚡ Root orchestration scripts
└── README.md                 # Project documentation
```

---

## 🌟 Why KinBridge?

During teenage years, families often get locked into reactive cycles:
- **Parents** speak from protective anxiety, safety concerns, and life foresight.
- **Teens** are developing autonomy, personal identity, and peer relationships.

**KinBridge** acts as a compassionate, non-judgmental AI mediator that:
1. **Understands Both Perspectives**: Dual-perspective input allows both sides to express raw feelings safely.
2. **Maintains a Healthy Developmental Gap**: Balances parental safety needs with teenage autonomy needs.
3. **Formulates Grounded Decisions**: Replaces authoritarian rules or permissive drift with stepped trials, clear boundaries, and earned trust.
4. **Decodes Raw Emotions**: The **Perspective Translator** translates angry outbursts (*"You never trust me!"*) into constructive *"I"* statements.
5. **Formalizes Agreements**: Digital signatures ratify win-win compromises into accountable family pacts.

---

## ⚡ Quick Start Guide (Node 24+)

### Option 1: Run Full Project in 1 Command
From the root directory:
```bash
# 1. Install dependencies for both frontend and backend
npm run install:all

# 2. Build the frontend
npm run build

# 3. Start the server (serves both API and Frontend on port 3000)
npm start
```
Now open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

### Option 2: Run Separately (Independent Terminals)

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm start
```
*(Runs on `http://localhost:3000`)*

**Terminal 2 — Frontend (with Hot Reload):**
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173` with instant proxy to backend)*

---

## 🛡️ Technologies Used
- **Node.js v24+**: Uses Node 24's native `DatabaseSync` (`node:sqlite`). Zero Python or `node-gyp` compilation errors!
- **React.js 19 + Vite**: Modern, responsive UI with Lucide icons.
- **Express.js 5**: High-performance RESTful APIs.
- **Google Gemini AI**: `@google/genai` with `gemini-3.8-flash` and automatic fallback to a resilient local psychological heuristic mediator.
