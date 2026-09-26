import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Smile, 
  Frown, 
  Meh, 
  Send, 
  Shield, 
  Headphones, 
  Activity,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function MoodPulse({ userRole }) {
  const [role, setRole] = useState(userRole === 'teen' ? 'teen' : 'parent');
  const [mood, setMood] = useState(4);
  const [stress, setStress] = useState(2);
  const [feelingHeard, setFeelingHeard] = useState(4);
  const [note, setNote] = useState('');
  const [checkins, setCheckins] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedJustNow, setSubmittedJustNow] = useState(false);

  useEffect(() => {
    if (userRole === 'teen') setRole('teen');
    if (userRole === 'parent') setRole('parent');
  }, [userRole]);

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      const res = await fetch('/api/checkins');
      if (res.ok) {
        const data = await res.json();
        setCheckins(data);
      }
    } catch (err) {
      console.error('Error fetching checkins:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          mood_score: mood,
          stress_level: stress,
          feeling_heard_score: feelingHeard,
          note
        })
      });

      if (res.ok) {
        const newCheckin = await res.json();
        setCheckins(prev => [newCheckin, ...prev]);
        setNote('');
        setSubmittedJustNow(true);
        setTimeout(() => setSubmittedJustNow(false), 3000);
      }
    } catch (err) {
      console.error('Checkin submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Intro */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: 8, borderRadius: 10 }}>
            <HeartHandshake size={22} color="#ec4899" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Daily Mood & Connection Pulse</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Check in for 30 seconds daily to catch friction early before it becomes an explosive argument.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Check-in Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: 16 }}>Log Today's Pulse</h3>

          {/* Persona selector */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`btn ${role === 'parent' ? 'btn-parent' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Shield size={14} /> Parent Check-in
            </button>
            <button
              type="button"
              onClick={() => setRole('teen')}
              className={`btn ${role === 'teen' ? 'btn-teen' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Headphones size={14} /> Teen Check-in
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Mood Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.86rem' }}>
                <span style={{ color: '#cbd5e1' }}>Overall Emotional Mood:</span>
                <strong style={{ color: mood >= 4 ? '#34d399' : mood === 3 ? '#f59e0b' : '#f87171' }}>
                  {mood === 5 ? '😄 Wonderful' : mood === 4 ? '🙂 Good' : mood === 3 ? '😐 Neutral' : mood === 2 ? '😕 Down' : '😫 Frustrated'} ({mood}/5)
                </strong>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={mood} 
                onChange={(e) => setMood(Number(e.target.value))} 
              />
            </div>

            {/* Stress Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.86rem' }}>
                <span style={{ color: '#cbd5e1' }}>Stress / Anxiety Level:</span>
                <strong style={{ color: stress <= 2 ? '#34d399' : stress === 3 ? '#f59e0b' : '#f87171' }}>
                  {stress === 1 ? '😌 Peaceful' : stress === 2 ? '🙂 Manageable' : stress === 3 ? '😬 Moderate' : stress === 4 ? '😰 High' : '🌋 Overwhelmed'} ({stress}/5)
                </strong>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={stress} 
                onChange={(e) => setStress(Number(e.target.value))} 
              />
            </div>

            {/* Feeling Heard Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.86rem' }}>
                <span style={{ color: '#cbd5e1' }}>Do you feel heard & understood at home?</span>
                <strong style={{ color: feelingHeard >= 4 ? '#34d399' : feelingHeard === 3 ? '#f59e0b' : '#f87171' }}>
                  {feelingHeard >= 4 ? '👂 Deeply Heard' : feelingHeard === 3 ? '🤷 Somewhat' : '🔇 Completely Misunderstood'} ({feelingHeard}/5)
                </strong>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={feelingHeard} 
                onChange={(e) => setFeelingHeard(Number(e.target.value))} 
              />
            </div>

            {/* Note */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: 6 }}>
                Quick reflection / what went well today? (Optional):
              </label>
              <input 
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. 'Loved our chat over lunch' or 'Need some quiet time tonight'"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn ${role === 'parent' ? 'btn-parent' : 'btn-teen'}`}
              style={{ marginTop: 6 }}
            >
              {submittedJustNow ? (
                <>
                  <CheckCircle2 size={16} /> Recorded! Keep Growing
                </>
              ) : (
                <>
                  <Send size={16} /> Record Today's Pulse
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent History Table */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} color="#38bdf8" /> Recent Family Pulses
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: 380 }}>
            {checkins.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>No check-ins logged yet.</p>
            ) : (
              checkins.map(ck => {
                const isParent = ck.role === 'parent';
                return (
                  <div
                    key={ck.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderLeft: `3px solid ${isParent ? '#f97316' : '#8b5cf6'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isParent ? '#fb923c' : '#c4b5fd' }}>
                        {isParent ? '🛡️ Parent (Sarah)' : '🎧 Teen (Leo)'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {new Date(ck.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 14, fontSize: '0.78rem', color: '#cbd5e1' }}>
                      <span>Mood: <strong>{ck.mood_score}/5</strong></span>
                      <span>Stress: <strong>{ck.stress_level}/5</strong></span>
                      <span>Heard: <strong>{ck.feeling_heard_score}/5</strong></span>
                    </div>

                    {ck.note && (
                      <p style={{ fontSize: '0.84rem', color: '#f1f5f9', fontStyle: 'italic', marginTop: 2 }}>
                        "{ck.note}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
