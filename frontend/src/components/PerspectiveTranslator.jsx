import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Shield, 
  Headphones, 
  Heart, 
  HelpCircle, 
  Lightbulb,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function PerspectiveTranslator({ userRole, onSendToChat }) {
  const [speakerRole, setSpeakerRole] = useState(userRole === 'parent' ? 'parent' : 'teen');
  const [rawThought, setRawThought] = useState('');
  const [translationResult, setTranslationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const samplePrompts = speakerRole === 'teen' ? [
    "You never let me do anything, you treat me like a 10 year old!",
    "Why are you always spying on my phone and texts?!",
    "Stop nagging me about college every single day!",
    "All my friends stay out later than me, it's embarrassing."
  ] : [
    "You just sit on your phone all day doing nothing useful!",
    "If you don't study right now you are going to ruin your entire future!",
    "You never listen to a single word I say, it's pure disrespect!",
    "Why do you keep your door closed all day like we don't exist?"
  ];

  const handleTranslate = async (textToTranslate) => {
    const input = textToTranslate || rawThought;
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawThought: input,
          speakerRole: speakerRole,
          recipientRole: speakerRole === 'parent' ? 'teen' : 'parent'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTranslationResult(data);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Intro Header */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: 8, borderRadius: 10 }}>
            <Sparkles size={22} color="#a78bfa" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Perspective Translator: Speak Without Igniting a Fight</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Raw anger and defensive reactions usually hide vulnerable needs. Let the AI decode your real feelings into grounded words your family can actually hear.
            </p>
          </div>
        </div>

        {/* Persona toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>I AM A:</span>
          <button
            onClick={() => { setSpeakerRole('parent'); setTranslationResult(null); }}
            className={`btn ${speakerRole === 'parent' ? 'btn-parent' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', fontSize: '0.84rem' }}
          >
            <Shield size={15} /> Parent Speaking to Teen
          </button>
          <button
            onClick={() => { setSpeakerRole('teen'); setTranslationResult(null); }}
            className={`btn ${speakerRole === 'teen' ? 'btn-teen' : 'btn-secondary'}`}
            style={{ padding: '6px 16px', fontSize: '0.84rem' }}
          >
            <Headphones size={15} /> Teen Speaking to Parent
          </button>
        </div>
      </div>

      {/* Input Area & Sample Chips */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, color: '#f1f5f9' }}>
          What are you feeling tempted to blurt out? (Raw, unfiltered thought):
        </label>
        <textarea
          rows={3}
          value={rawThought}
          onChange={(e) => setRawThought(e.target.value)}
          placeholder={speakerRole === 'parent' ? "e.g. 'You are wasting your life playing games and never helping around the house!'" : "e.g. 'You ruin my life and don't trust me with anything!'"}
          style={{ width: '100%', marginBottom: 12 }}
        />

        {/* Sample quick prompts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Try a real scenario:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setRawThought(p);
                handleTranslate(p);
              }}
              style={{
                fontSize: '0.76rem',
                padding: '4px 10px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                cursor: 'pointer'
              }}
            >
              "{p.slice(0, 36)}..."
            </button>
          ))}
        </div>

        <button
          onClick={() => handleTranslate()}
          disabled={isLoading || !rawThought.trim()}
          className="btn btn-primary"
          style={{ padding: '10px 24px' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={17} />
              Decoding Underlying Emotion & Translating...
            </>
          ) : (
            <>
              <Sparkles size={17} />
              Translate to Grounded Communication
            </>
          )}
        </button>
      </div>

      {/* Translation Results Card */}
      {translationResult && (
        <div className="glass-panel animate-fade-in" style={{ padding: '28px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          {/* Psychology analysis breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f43f5e', marginBottom: 6 }}>
                <Heart size={16} />
                <strong style={{ fontSize: '0.88rem' }}>Underlying Emotion Decoded</strong>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1' }}>
                {translationResult.underlyingEmotion}
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', marginBottom: 6 }}>
                <Lightbulb size={16} />
                <strong style={{ fontSize: '0.88rem' }}>What You Are Really Saying</strong>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#cbd5e1' }}>
                "{translationResult.whatTheyReallyMean}"
              </p>
            </div>
          </div>

          {/* 3 Translation Styles */}
          <h3 style={{ fontSize: '1.15rem', marginBottom: 16 }}>Choose Your Grounded Delivery:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Style 1: Vulnerable */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '18px 20px',
              borderRadius: 14,
              borderLeft: '4px solid #8b5cf6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' }}>
                  Option 1: Vulnerable / Honest Feeling ('I' statement)
                </span>
                <button
                  onClick={() => copyToClipboard(translationResult.translations.vulnerable, 'vulnerable')}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                >
                  {copiedKey === 'vulnerable' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copiedKey === 'vulnerable' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.6 }}>
                "{translationResult.translations.vulnerable}"
              </p>
            </div>

            {/* Style 2: Curious */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '18px 20px',
              borderRadius: 14,
              borderLeft: '4px solid #38bdf8'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Option 2: Curious & Collaborative
                </span>
                <button
                  onClick={() => copyToClipboard(translationResult.translations.curious, 'curious')}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                >
                  {copiedKey === 'curious' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copiedKey === 'curious' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.6 }}>
                "{translationResult.translations.curious}"
              </p>
            </div>

            {/* Style 3: Grounded */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '18px 20px',
              borderRadius: 14,
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                  Option 3: Grounded & Proposal-Oriented (Compromise)
                </span>
                <button
                  onClick={() => copyToClipboard(translationResult.translations.grounded, 'grounded')}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                >
                  {copiedKey === 'grounded' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copiedKey === 'grounded' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.6 }}>
                "{translationResult.translations.grounded}"
              </p>
            </div>
          </div>

          {/* Delivery Tip */}
          {translationResult.communicationTip && (
            <div style={{
              marginTop: 20,
              padding: '12px 18px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.85rem',
              color: '#fcd34d'
            }}>
              <HelpCircle size={16} />
              <span><strong>Mediator Body Language Tip:</strong> {translationResult.communicationTip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
