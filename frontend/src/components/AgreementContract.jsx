import React, { useState } from 'react';
import { 
  FileCheck, 
  CheckCircle, 
  Clock, 
  Shield, 
  Headphones, 
  Award, 
  Calendar,
  PenTool,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AgreementContract({ agreements, onSignAgreement, userRole }) {
  const [signingId, setSigningId] = useState(null);

  const handleSign = async (agreementId, role) => {
    setSigningId(agreementId);
    await onSignAgreement(agreementId, role);
    setSigningId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: 8, borderRadius: 10 }}>
            <FileCheck size={22} color="#10b981" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Family Agreements & Mutual Pacts</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Turning arguments into clear, fair contracts with earned autonomy and accountability. Both sides commit in writing.
            </p>
          </div>
        </div>
      </div>

      {/* Agreements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {agreements.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <FileCheck size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <p>No family agreements recorded yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Run a mediation on an active dilemma to generate your first mutual contract!</p>
          </div>
        ) : (
          agreements.map(ag => {
            const isFullySigned = ag.parent_signed && ag.teen_signed;
            return (
              <div 
                key={ag.id} 
                className="glass-panel" 
                style={{ 
                  padding: '24px 28px',
                  borderTop: isFullySigned ? '4px solid #10b981' : '4px solid #f59e0b'
                }}
              >
                {/* Title & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 4 }}>{ag.title}</h3>
                    {ag.conflict_title && (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Linked to: <em>{ag.conflict_title}</em>
                      </span>
                    )}
                  </div>

                  <span className={`badge ${isFullySigned ? 'badge-mediator' : 'badge-neutral'}`}>
                    {isFullySigned ? <CheckCircle size={13} /> : <Clock size={13} />}
                    {isFullySigned ? 'Fully Ratified Pact' : 'Awaiting Signatures'}
                  </span>
                </div>

                {/* The Mutual Pledges */}
                <div className="grid-2" style={{ marginBottom: 20 }}>
                  {/* Parent Pledge */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#fb923c' }}>
                      <Shield size={16} />
                      <strong style={{ fontSize: '0.9rem' }}>Parent's Pledge (Sarah)</strong>
                    </div>
                    <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                      "{ag.parent_pledge}"
                    </p>
                  </div>

                  {/* Teen Pledge */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#c4b5fd' }}>
                      <Headphones size={16} />
                      <strong style={{ fontSize: '0.9rem' }}>Teen's Pledge (Leo)</strong>
                    </div>
                    <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                      "{ag.teen_pledge}"
                    </p>
                  </div>
                </div>

                {/* Boundaries & Rewards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 20 }}>
                  {ag.safety_boundary && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                        <AlertCircle size={14} /> Clear Boundary / Red Line
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#fecaca' }}>{ag.safety_boundary}</p>
                    </div>
                  )}

                  {ag.reward_or_privilege && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                        <Award size={14} /> Earned Autonomy / Reward
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#d1fae5' }}>{ag.reward_or_privilege}</p>
                    </div>
                  )}

                  <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                      <Calendar size={14} /> Mutual Review Date
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#e0f2fe' }}>{ag.check_in_date || 'In 2 Weeks'}</p>
                  </div>
                </div>

                {/* Signatures & Execution Section */}
                <div style={{
                  padding: '16px 20px',
                  borderRadius: 12,
                  background: 'rgba(15, 23, 42, 0.6)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16
                }}>
                  {/* Signature Badges */}
                  <div style={{ display: 'flex', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Parent Signature:</span>
                      {ag.parent_signed ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#34d399', fontWeight: 700, fontSize: '0.88rem' }}>
                          <CheckCircle2 size={16} /> Signed (Sarah) ✍️
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSign(ag.id, 'parent')}
                          disabled={signingId === ag.id || (userRole === 'teen')}
                          className="btn btn-parent"
                          style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                          title={userRole === 'teen' ? 'Switch to Parent Mode to sign' : 'Sign contract as Parent'}
                        >
                          <PenTool size={13} /> Sign as Parent
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Teen Signature:</span>
                      {ag.teen_signed ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#34d399', fontWeight: 700, fontSize: '0.88rem' }}>
                          <CheckCircle2 size={16} /> Signed (Leo) ✍️
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSign(ag.id, 'teen')}
                          disabled={signingId === ag.id || (userRole === 'parent')}
                          className="btn btn-teen"
                          style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                          title={userRole === 'parent' ? 'Switch to Teen Mode to sign' : 'Sign contract as Teen'}
                        >
                          <PenTool size={13} /> Sign as Teen
                        </button>
                      )}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Created: {new Date(ag.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
