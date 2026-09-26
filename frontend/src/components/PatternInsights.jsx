import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Headphones, 
  Heart, 
  CheckCircle, 
  RefreshCw,
  Award,
  Zap,
  Loader2
} from 'lucide-react';

export default function PatternInsights() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/insights');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error loading insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={36} color="#8b5cf6" style={{ margin: '0 auto 16px auto' }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: 6 }}>AI Analyzing Family Dynamic Patterns...</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Synthesizing recurring conflict themes, emotional check-ins, and mutual compromises.
        </p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const insights = data?.insights || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: 8, borderRadius: 10 }}>
            <TrendingUp size={22} color="#38bdf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Family Pattern Recognition & Growth Radar</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Understand the recurring psychological undercurrents between parent safety and teen independence.
            </p>
          </div>
        </div>

        <button onClick={fetchInsights} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
          <RefreshCw size={14} /> Refresh AI Analysis
        </button>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {/* Harmony Index */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Family Harmony Index
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', margin: '6px 0' }}>
            {insights.harmonyIndex || 82}%
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            Healthy developmental tension being actively bridged
          </p>
        </div>

        {/* Total Dilemmas */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #8b5cf6' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Managed Dilemmas
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#a78bfa', margin: '6px 0' }}>
            {stats.totalConflicts || 0}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            {stats.resolvedConflicts || 0} resolved into mutual agreements
          </p>
        </div>

        {/* Active Pacts */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', borderTop: '4px solid #f97316' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Ratified Family Pacts
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fb923c', margin: '6px 0' }}>
            {stats.activeAgreements || 0}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            Written commitments with review dates
          </p>
        </div>
      </div>

      {/* Primary Pattern Synthesis */}
      <div className="glass-panel" style={{ padding: '24px 28px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', marginBottom: 10 }}>
          <Zap size={20} />
          <h3 style={{ fontSize: '1.2rem' }}>Core Relational Pattern</h3>
        </div>
        <p style={{ fontSize: '1.05rem', color: '#f8fafc', lineHeight: 1.6, marginBottom: 16 }}>
          {insights.primaryPattern || "Balancing Teen Autonomy & Peer Connection with Parental Reassurance & Safety"}
        </p>

        {/* Family Strengths */}
        <div>
          <strong style={{ fontSize: '0.88rem', color: '#34d399', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Identified Family Strengths:
          </strong>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(insights.familyStrengths || []).map((s, idx) => (
              <span key={idx} style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#d1fae5',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: '0.84rem'
              }}>
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Guidance Tips (Parent vs Teen) */}
      <div className="grid-2">
        {/* Parent Growth Tips */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fb923c', marginBottom: 14 }}>
            <Shield size={20} />
            <h3 style={{ fontSize: '1.15rem' }}>Grounded Advice for Sarah (Parent)</h3>
          </div>
          <ul style={{ paddingLeft: 18, fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(insights.parentTips || []).map((tip, idx) => (
              <li key={idx} style={{ lineHeight: 1.5 }}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Teen Growth Tips */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#c4b5fd', marginBottom: 14 }}>
            <Headphones size={20} />
            <h3 style={{ fontSize: '1.15rem' }}>Grounded Advice for Leo (Teen)</h3>
          </div>
          <ul style={{ paddingLeft: 18, fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(insights.teenTips || []).map((tip, idx) => (
              <li key={idx} style={{ lineHeight: 1.5 }}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Uplifting Encouragement */}
      {insights.encouragement && (
        <div style={{
          padding: '18px 24px',
          borderRadius: 14,
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <Heart size={24} color="#a78bfa" />
          <p style={{ fontSize: '0.95rem', color: '#e2e8f0', fontStyle: 'italic', margin: 0 }}>
            "{insights.encouragement}"
          </p>
        </div>
      )}
    </div>
  );
}
