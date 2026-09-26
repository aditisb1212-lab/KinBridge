import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  Headphones, 
  Sparkles, 
  FileCheck, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Heart,
  Calendar,
  Save,
  Loader2
} from 'lucide-react';

export default function ConflictDetail({ 
  conflict, 
  onBack, 
  userRole, 
  onUpdatePerspective, 
  onRunMediation,
  onOpenChat,
  onCreateAgreement,
  isMediating
}) {
  const [parentInput, setParentInput] = useState(conflict.parent_perspective || '');
  const [teenInput, setTeenInput] = useState(conflict.teen_perspective || '');
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [isEditingTeen, setIsEditingTeen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePerspective = async (role) => {
    setIsSaving(true);
    const content = role === 'parent' ? parentInput : teenInput;
    await onUpdatePerspective(conflict.id, role, content);
    setIsSaving(false);
    if (role === 'parent') setIsEditingParent(false);
    if (role === 'teen') setIsEditingTeen(false);
  };

  const mediation = conflict.mediation;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Dilemmas
        </button>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-neutral">{conflict.category}</span>
          <span className={`badge ${conflict.status === 'resolved' ? 'badge-mediator' : 'badge-parent'}`}>
            Status: {conflict.status.replace('_', ' ')}
          </span>
          <button 
            onClick={() => onOpenChat(conflict.id)}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <MessageSquare size={15} /> Join Live Room
          </button>
        </div>
      </div>

      {/* Main Conflict Header */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 8 }}>{conflict.title}</h1>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>
          {conflict.description || 'Describe the situation and context so both sides understand what sparked this dilemma.'}
        </p>
      </div>

      {/* Dual Perspectives (Parent vs Teen) */}
      <div className="grid-2">
        {/* Parent Column */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '24px', 
            borderTop: '4px solid #f97316',
            background: userRole === 'parent' ? 'rgba(249, 115, 22, 0.05)' : 'rgba(30, 41, 59, 0.7)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: 'rgba(249, 115, 22, 0.2)', padding: 6, borderRadius: 8 }}>
                <Shield size={20} color="#f97316" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fb923c' }}>Parent Perspective (Sarah)</h3>
            </div>

            {(userRole === 'parent' || userRole === 'all') && (
              !isEditingParent ? (
                <button 
                  onClick={() => setIsEditingParent(true)} 
                  className="btn btn-ghost" 
                  style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                >
                  Edit Stance
                </button>
              ) : (
                <button 
                  onClick={() => handleSavePerspective('parent')} 
                  disabled={isSaving}
                  className="btn btn-parent" 
                  style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                >
                  <Save size={14} /> Save
                </button>
              )
            )}
          </div>

          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 12 }}>
            Focus: Health, safety, long-term preparation, and family boundaries.
          </p>

          {isEditingParent ? (
            <textarea
              rows={5}
              value={parentInput}
              onChange={(e) => setParentInput(e.target.value)}
              placeholder="What are your deepest concerns? (e.g., 'I want him safe and well-rested for school...')"
              style={{ width: '100%', resize: 'vertical' }}
            />
          ) : (
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '16px',
              borderRadius: 12,
              minHeight: 120,
              fontSize: '0.94rem',
              color: conflict.parent_perspective ? '#f1f5f9' : '#64748b',
              fontStyle: conflict.parent_perspective ? 'normal' : 'italic'
            }}>
              {conflict.parent_perspective || 'No parent perspective shared yet. Switch to Parent Mode to add thoughts.'}
            </div>
          )}
        </div>

        {/* Teen Column */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '24px', 
            borderTop: '4px solid #8b5cf6',
            background: userRole === 'teen' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(30, 41, 59, 0.7)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: 6, borderRadius: 8 }}>
                <Headphones size={20} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#c4b5fd' }}>Teen Perspective (Leo)</h3>
            </div>

            {(userRole === 'teen' || userRole === 'all') && (
              !isEditingTeen ? (
                <button 
                  onClick={() => setIsEditingTeen(true)} 
                  className="btn btn-ghost" 
                  style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                >
                  Edit Stance
                </button>
              ) : (
                <button 
                  onClick={() => handleSavePerspective('teen')} 
                  disabled={isSaving}
                  className="btn btn-teen" 
                  style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                >
                  <Save size={14} /> Save
                </button>
              )
            )}
          </div>

          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 12 }}>
            Focus: Peer connection, autonomy, individuality, and feeling trusted.
          </p>

          {isEditingTeen ? (
            <textarea
              rows={5}
              value={teenInput}
              onChange={(e) => setTeenInput(e.target.value)}
              placeholder="What do you feel and need? (e.g., 'I want to feel trusted and not treated like a kid...')"
              style={{ width: '100%', resize: 'vertical' }}
            />
          ) : (
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '16px',
              borderRadius: 12,
              minHeight: 120,
              fontSize: '0.94rem',
              color: conflict.teen_perspective ? '#f1f5f9' : '#64748b',
              fontStyle: conflict.teen_perspective ? 'normal' : 'italic'
            }}>
              {conflict.teen_perspective || 'No teen perspective shared yet. Switch to Teen Mode to add thoughts.'}
            </div>
          )}
        </div>
      </div>

      {/* Mediation Trigger Banner */}
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <button
          onClick={() => onRunMediation(conflict.id)}
          disabled={isMediating}
          className="btn btn-mediator"
          style={{
            padding: '14px 28px',
            fontSize: '1.05rem',
            borderRadius: 30,
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)'
          }}
        >
          {isMediating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              AI Agent Analyzing Both Perspectives...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              {mediation ? 'Re-Run Grounded AI Mediation' : 'Run Grounded AI Mediation & Compromise'}
            </>
          )}
        </button>
      </div>

      {/* AI Grounded Mediation Card */}
      {mediation && (
        <div className="glass-panel animate-fade-in" style={{ padding: '28px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: 8, borderRadius: 10 }}>
                <Sparkles size={22} color="#10b981" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#34d399' }}>KinBridge Grounded Decision Engine</h2>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Psychological Pattern Analysis & Win-Win Resolution
                </span>
              </div>
            </div>

            <button
              onClick={() => onCreateAgreement(conflict, mediation)}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <FileCheck size={16} /> Formalize as Family Agreement
            </button>
          </div>

          {/* Compassionate Summary */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            borderLeft: '4px solid #10b981',
            padding: '16px 20px',
            borderRadius: '0 12px 12px 0',
            marginBottom: 24,
            fontSize: '0.98rem',
            lineHeight: 1.6,
            color: '#e2e8f0'
          }}>
            <strong>Mediator Synthesis:</strong> {mediation.summary}
          </div>

          {/* Deep Psychological Needs (Parent vs Teen vs Common Ground) */}
          <div className="grid-3" style={{ marginBottom: 24 }}>
            {/* Parent Unspoken Drivers */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#fb923c' }}>
                <Shield size={16} />
                <h4 style={{ fontSize: '0.92rem' }}>Parent's Unspoken Drivers</h4>
              </div>
              <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(mediation.parent_underlying_needs || []).map((need, idx) => (
                  <li key={idx}>{need}</li>
                ))}
              </ul>
            </div>

            {/* Teen Unspoken Drivers */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#c4b5fd' }}>
                <Headphones size={16} />
                <h4 style={{ fontSize: '0.92rem' }}>Teen's Unspoken Drivers</h4>
              </div>
              <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(mediation.teen_underlying_needs || []).map((need, idx) => (
                  <li key={idx}>{need}</li>
                ))}
              </ul>
            </div>

            {/* Common Ground */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#34d399' }}>
                <Heart size={16} />
                <h4 style={{ fontSize: '0.92rem' }}>Shared Common Ground</h4>
              </div>
              <ul style={{ paddingLeft: 18, fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(mediation.common_ground || []).map((ground, idx) => (
                  <li key={idx}>{ground}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* The Grounded Decision */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '24px',
            borderRadius: 16,
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#38bdf8' }}>
              <Lightbulb size={20} />
              <h3 style={{ fontSize: '1.25rem' }}>The Grounded Win-Win Compromise</h3>
            </div>
            <p style={{ fontSize: '1rem', color: '#f1f5f9', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {mediation.grounded_decision}
            </p>
          </div>

          {/* Commitments & Review Period */}
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
              <h4 style={{ fontSize: '0.95rem', color: '#fb923c', marginBottom: 10 }}>
                🛡️ Parent's Commitments:
              </h4>
              <ul style={{ paddingLeft: 18, fontSize: '0.88rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(mediation.parent_commitments || []).map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
              <h4 style={{ fontSize: '0.95rem', color: '#c4b5fd', marginBottom: 10 }}>
                🎧 Teen's Commitments:
              </h4>
              <ul style={{ paddingLeft: 18, fontSize: '0.88rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(mediation.teen_commitments || []).map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Review Period & Uplifting Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            padding: '14px 18px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', color: '#94a3b8' }}>
              <Calendar size={16} color="#38bdf8" />
              <span>Review Check-in Period: <strong style={{ color: '#fff' }}>{mediation.review_period}</strong></span>
            </div>

            <div style={{ fontSize: '0.88rem', color: '#a78bfa', fontStyle: 'italic', maxWidth: 600 }}>
              "{mediation.positive_reinforcement_note}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
