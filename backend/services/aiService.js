const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Warning: Failed to initialize GoogleGenAI with key:', err.message);
  }
}

// Waterfall candidate models supported in current Gemini ecosystem
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash-lite'];

async function callGemini(generateFn) {
  if (!aiClient) return null;
  for (const model of CANDIDATE_MODELS) {
    try {
      return await generateFn(model);
    } catch (err) {
      console.warn(`Model ${model} attempt error:`, err.status || err.message?.slice(0, 100));
    }
  }
  return null;
}

/**
 * Intelligent Grounded AI Conflict Mediation
 */
async function mediateConflict({ title, category, parentPerspective, teenPerspective, description }) {
  const prompt = `
You are KinBridge AI, an elite compassionate family mediator and adolescent psychologist.
Your mission is to understand both the parent and teen, maintain a healthy respectful developmental gap between them, and construct grounded win-win decisions that satisfy both sides according to their true feelings and underlying thoughts.

Conflict Details:
- Title: ${title}
- Category: ${category}
- Context/Background: ${description || 'N/A'}
- Parent's Stated Perspective: "${parentPerspective || 'Not yet provided'}"
- Teen's Stated Perspective: "${teenPerspective || 'Not yet provided'}"

Instructions:
1. Deeply analyze the psychological needs:
   - For Parent: often driven by love, safety anxiety, life experience, fear of future failure, wanting to stay connected.
   - For Teen: driven by identity formation, social belonging with peers, desire for autonomy, need to feel trusted and not infantilized.
2. Formulate grounded decisions: practical, clear boundaries combined with earned autonomy.
3. Be 100% positive, supportive, de-escalating, and empathetic. No shaming or taking one person's side over the other.

Respond ONLY with valid JSON with the following structure:
{
  "summary": "Compassionate executive summary explaining why both sides make total sense.",
  "parentUnderlyingNeeds": ["Need 1", "Need 2", "Need 3"],
  "teenUnderlyingNeeds": ["Need 1", "Need 2", "Need 3"],
  "commonGround": ["Shared value 1", "Shared value 2"],
  "groundedDecision": "Detailed step-by-step balanced compromise that honors parent safety/values and teen independence.",
  "parentCommitments": ["Parent pledge 1", "Parent pledge 2"],
  "teenCommitments": ["Teen pledge 1", "Teen pledge 2"],
  "reviewPeriod": "e.g., 2-3 Weeks trial period",
  "positiveReinforcementNote": "An uplifting, warm message celebrating both parent and teen for listening to each other."
}
`;

  const result = await callGemini(async (model) => {
    const res = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });
    return JSON.parse(res.text);
  });

  if (result) return result;
  return fallbackMediation({ title, category, parentPerspective, teenPerspective, description });
}

/**
 * Live 3-Way Family Chat Mediation
 */
async function generateMediatorReply({ conflictTitle, conversationHistory, newSpeakerRole, newMessage }) {
  const historyText = conversationHistory
    .map(m => `${m.sender_name || m.sender_role}: ${m.message}`)
    .join('\n');

  const prompt = `
You are KinBridge AI, an empathetic, supportive, and grounded family mediator participating in a real-time dialogue between a parent and their teenager.

Conflict Under Discussion: "${conflictTitle}"
Previous Dialogue:
${historyText}

Latest Message from ${newSpeakerRole}:
"${newMessage}"

Your Goal:
- Respond as the mediator in a calm, warm, and uplifting tone.
- Validate the speaker's emotional state (why their feeling is understandable).
- Highlight what the other party might be feeling underneath their defense mechanism.
- Steer the conversation away from blame or lecturing toward mutual understanding and grounded action.
- Keep your response concise (3 to 5 sentences), supportive, and end with a constructive, non-threatening question or compromise idea.
`;

  const result = await callGemini(async (model) => {
    const res = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return res.text.trim();
  });

  if (result) return result;
  return fallbackChatReply(newSpeakerRole, newMessage, conflictTitle);
}

/**
 * Perspective Translator
 */
async function translatePerspective({ rawThought, speakerRole, recipientRole }) {
  const prompt = `
You are the KinBridge Perspective Translator.
A ${speakerRole} wants to communicate with their ${recipientRole}, but their raw thoughts might sound accusatory, defensive, or confrontational.

Raw Input: "${rawThought}"

Your task is to decode the real vulnerability, emotion, and positive intention beneath this statement, and translate it into 3 supportive and constructive styles:
1. "Vulnerable / Honest Feeling" (Uses 'I feel' statements, reveals fears or wishes without blaming)
2. "Curious & Connecting" (Invites discussion and asks for the other person's perspective gently)
3. "Grounded & Solution-Oriented" (Offers a concrete win-win proposal or boundary)

Respond ONLY in JSON format:
{
  "underlyingEmotion": "e.g. Overwhelmed by expectations / Seeking autonomy / Protective anxiety",
  "whatTheyReallyMean": "e.g. I want to feel capable of managing my own life while knowing you support me.",
  "translations": {
    "vulnerable": "...",
    "curious": "...",
    "grounded": "..."
  },
  "communicationTip": "A 1-sentence tip on body language or timing for this conversation."
}
`;

  const result = await callGemini(async (model) => {
    const res = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });
    return JSON.parse(res.text);
  });

  if (result) return result;
  return fallbackTranslate(rawThought, speakerRole);
}

/**
 * Family Insights & Pattern Recognition
 */
async function generateFamilyInsights(conflicts, checkins) {
  const conflictSummaries = conflicts.map(c => `[${c.category}] ${c.title} (Status: ${c.status})`).join('\n');
  const recentCheckins = checkins.map(ck => `${ck.role}: Mood=${ck.mood_score}/5, Stress=${ck.stress_level}/5, Heard=${ck.feeling_heard_score}/5 | ${ck.note || ''}`).join('\n');

  const prompt = `
Analyze the following family conflicts and emotional check-in history to find behavioral patterns and actionable growth opportunities.

Conflicts:
${conflictSummaries || 'None logged yet'}

Recent Check-ins:
${recentCheckins || 'None logged yet'}

Generate:
1. Core dynamic pattern (what is the underlying tension: e.g., control vs autonomy, digital boundaries vs connection, academic expectations vs self-worth).
2. Strengths of this family.
3. Top 3 grounded positive suggestions for the parent.
4. Top 3 grounded positive suggestions for the teen.
5. Overall Harmony Index (number between 0 and 100).

Return ONLY valid JSON:
{
  "harmonyIndex": 78,
  "primaryPattern": "...",
  "familyStrengths": ["...", "..."],
  "parentTips": ["...", "...", "..."],
  "teenTips": ["...", "...", "..."],
  "encouragement": "..."
}
`;

  const result = await callGemini(async (model) => {
    const res = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });
    return JSON.parse(res.text);
  });

  if (result) return result;

  return {
    harmonyIndex: 84,
    primaryPattern: "Balancing Teen Autonomy & Peer Connection with Parental Reassurance & Safety",
    familyStrengths: [
      "Both parent and teen care deeply about maintaining open communication",
      "Willingness to seek structured mediation rather than silent resentment",
      "High emotional intelligence once feelings are translated constructively"
    ],
    parentTips: [
      "Frame safety boundaries around care rather than authority or suspicion.",
      "Replace 'Did you finish your homework?' with 'How was your energy today?' as a greeting.",
      "Offer choices within safe boundaries rather than unilateral mandates."
    ],
    teenTips: [
      "Proactive communication (texting updates before being asked) builds trust faster than arguing.",
      "Acknowledge that parental caution usually stems from anxiety for your well-being, not malice.",
      "Propose stepped trial periods for privileges to demonstrate responsibility."
    ],
    encouragement: "Every generation experiences this tension. By honoring both wisdom and developing independence, your family is building a lifelong adult bond!"
  };
}

// Fallback Generators
function fallbackMediation({ title, category, parentPerspective, teenPerspective }) {
  return {
    summary: `Both parent and teen care deeply about each other and the outcome of "${title}". The parent's stance is anchored in protective foresight, safety, and healthy habits. The teen's stance is anchored in legitimate developmental needs for identity, peer inclusion, and trust.`,
    parentUnderlyingNeeds: [
      "Ensuring long-term well-being, safety, and health",
      "Feeling respected and acknowledged for guidance given",
      "Relief from anxiety when out of direct sight or supervision"
    ],
    teenUnderlyingNeeds: [
      "Agency, independence, and progressive autonomy",
      "Social connection without feeling socially isolated from peers",
      "Feeling trusted to make sound choices and learn from experience"
    ],
    commonGround: [
      "Both desire a peaceful, loving home environment free of yelling",
      "Both value safety and preparing the teen for responsible adulthood",
      "Both want mutual respect and authentic trust"
    ],
    groundedDecision: `Grounded 3-Part Compromise for ${title}:
1. Stepped Autonomy: Agree to the requested freedom under a structured 2-week trial period with clearly defined check-in milestones.
2. Safety & Transparency Anchor: Teen agrees to proactive, predictable communication (e.g. prompt location ping or status check) without parent having to chase them.
3. Natural Consequences: If terms are kept reliably, privileges are renewed and expanded. If broken, the previous boundary resets calmly without lecturing for 7 days before a re-evaluation.`,
    parentCommitments: [
      "Commit to not sending repeated anxious follow-ups once check-in terms are met",
      "Validate the teen's growing competence and offer genuine words of praise",
      "Listen first without immediately offering corrective lectures"
    ],
    teenCommitments: [
      "Initiate check-ins punctually and keep phone charged and accessible",
      "Express disagreements with respectful language rather than slamming doors or shutting down",
      "Demonstrate responsibility in daily commitments (schoolwork and home care)"
    ],
    reviewPeriod: "2-Week Grounded Check-In",
    positiveReinforcementNote: "Disagreement is not dysfunction—it is the sound of a young adult learning to navigate the world and a caring parent holding the anchor. You are both doing great work!"
  };
}

function fallbackChatReply(speakerRole, message, title) {
  if (speakerRole === 'parent') {
    return `Thank you for sharing your thoughts so openly. It's completely natural as a parent to feel protective about "${title}". Beneath your words, there is genuine love and care for your teen's future and safety. To help your teen hear your heart rather than feeling restricted, could you express what specific reassurance would help you feel peaceful?`;
  } else {
    return `I hear how frustrating this feels, and your desire for independence and respect is totally valid. When you are growing up, feeling micromanaged can feel like distrust. If we show your parent that you can manage this responsibility with a clear check-in plan, what is one commitment you would be proud to offer?`;
  }
}

function fallbackTranslate(rawThought, speakerRole) {
  const isParent = speakerRole === 'parent';
  return {
    underlyingEmotion: isParent ? "Worry about health, safety, and future success" : "Feeling controlled, judged, and misunderstood",
    whatTheyReallyMean: isParent 
      ? "I love you so much and want you to be safe, healthy, and happy, but sometimes I feel helpless." 
      : "I want to be trusted and respected as my own person, while still knowing you love me.",
    translations: {
      vulnerable: isParent 
        ? `When I see this happening, I get anxious about your well-being because I care about your future. Can we talk about how to balance this?`
        : `When this happens, I feel like you don't trust me or see how hard I try. I want us to be on the same team.`,
      curious: isParent
        ? `Help me understand what this means to you and how you are planning to handle your responsibilities.`
        : `I know you have reasons for this rule. Can we talk about what concerns you most so I can address it?`,
      grounded: isParent
        ? `Let's set up a 2-week trial where you have more freedom in exchange for reliable check-ins and responsibility.`
        : `If I keep my commitments and stay on top of my responsibilities, can we try this plan for two weeks and see how it goes?`
    },
    communicationTip: isParent 
      ? "Choose a relaxed moment outside of conflict (like in the car or over a snack) rather than when emotions are already high."
      : "Keep your voice calm and level; calm delivery immediately signals maturity to parents."
  };
}

module.exports = {
  mediateConflict,
  generateMediatorReply,
  translatePerspective,
  generateFamilyInsights
};
