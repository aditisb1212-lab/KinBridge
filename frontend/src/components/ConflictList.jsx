import React, { useState } from 'react';
import { 
  Scale, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Shield,
  Headphones,
  Sliders
} from 'lucide-react';

export default function ConflictList({ 
  conflicts, 
  selectedConflict, 
  onSelectConflict, 
  onOpenNewModal, 
  userRole,
  onImportPreset
}) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const categories = ['ALL', 'Curfew & Social Life', 'Screen Time & Tech', 'Academics & Future', 'Privacy & Trust'];

  const filteredConflicts = conflicts.filter(c => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner & Quick Actions */}
      <div className="glass-panel" style={{ padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="badge badge-mediator">
                <Sparkles size={13} /> AI Conflict Resolution Engine
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {conflicts.length} Total Family Dilemmas
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: 6 }}>
              {userRole === 'parent' 
                ? 'Parent Safe Space: Bridge Fears with Structure'
                : userRole === 'teen'
                ? 'Teen Voice: Express Autonomy with Respect'
                : 'Family Consensus & Grounded Decisions'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: 680 }}>
              Conflict is a natural sign of healthy adolescent development. Our AI mediator identifies the deep unspoken needs of both generations, crafting realistic win-win agreements.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button 
              onClick={() => onImportPreset(0)} 
              className="btn btn-secondary"
              title="Load realistic sample dilemmas (Curfew, Gaming, Driving)"
              style={{ fontSize: '0.85rem' }}
            >
              <Sliders size={16} /> Load Preset Scenario
            </button>
            <button 
              onClick={onOpenNewModal} 
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              + Raise New Dilemma
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.8rem',
                border: '1px solid ' + (filterCategory === cat ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)'),
                background: filterCategory === cat ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                color: filterCategory === cat ? '#c4b5fd' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['ALL', 'open', 'in_mediation', 'resolved'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                border: 'none',
                background: filterStatus === st ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: filterStatus === st ? '#fff' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Conflict Cards Grid */}
      <div className="grid-2">
        {filteredConflicts.map(item => {
          const isSelected = selectedConflict?.id === item.id;
          const hasParent = !!item.parent_perspective;
          const hasTeen = !!item.teen_perspective;
          const isResolved = item.status === 'resolved';

          return (
            <div
              key={item.id}
              onClick={() => onSelectConflict(item.id)}
              className="glass-panel"
              style={{
                padding: '20px 24px',
                cursor: 'pointer',
                borderColor: isSelected ? '#8b5cf6' : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'var(--shadow-sm)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16
              }}
            >
              <div>
                {/* Header Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    {item.category}
                  </span>
                  <span 
                    className={`badge ${
                      item.status === 'resolved' 
                        ? 'badge-mediator' 
                        : item.status === 'in_mediation' 
                        ? 'badge-teen' 
                        : 'badge-parent'
                    }`}
                  >
                    {item.status === 'resolved' && <CheckCircle size={12} />}
                    {item.status === 'in_mediation' && <Clock size={12} />}
                    {item.status === 'open' && <AlertCircle size={12} />}
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 style={{ fontSize: '1.15rem', marginBottom: 8, color: '#f8fafc' }}>
                  {item.title}
                </h3>
                <p style={{ 
                  fontSize: '0.88rem', 
                  color: '#94a3b8', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden' 
                }}>
                  {item.description || 'No additional background provided yet.'}
                </p>
              </div>

              {/* Perspective Readiness Indicators */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.4)',
                padding: '10px 14px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                    <Shield size={14} color={hasParent ? '#f97316' : '#64748b'} />
                    <span style={{ color: hasParent ? '#fed7aa' : '#64748b' }}>
                      Parent {hasParent ? '✓' : 'Pending'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                    <Headphones size={14} color={hasTeen ? '#a855f7' : '#64748b'} />
                    <span style={{ color: hasTeen ? '#e9d5ff' : '#64748b' }}>
                      Teen {hasTeen ? '✓' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a78bfa', fontSize: '0.84rem', fontWeight: 600 }}>
                  <span>{item.mediation_id ? 'Mediation Ready' : 'Explore'}</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
