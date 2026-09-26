import React from 'react';
import { 
  Scale, 
  MessageSquare, 
  Sparkles, 
  FileCheck, 
  TrendingUp, 
  HeartHandshake, 
  ShieldAlert, 
  Headphones,
  PlusCircle
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userRole, setUserRole, onOpenNewModal }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #10b981, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            🤝
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                KinBridge
              </span>
              <span className="badge badge-mediator" style={{ fontSize: '0.7rem' }}>
                AI Grounded
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Bridging Parents & Teens with Compassionate Guidance
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(30, 41, 59, 0.7)',
          padding: 4,
          borderRadius: 30,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0 8px', fontWeight: 600 }}>
            VIEW AS:
          </span>
          <button
            onClick={() => setUserRole('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: userRole === 'all' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
              color: userRole === 'all' ? '#fff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            👨‍👩‍👧 Family Hub
          </button>
          <button
            onClick={() => setUserRole('parent')}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: userRole === 'parent' ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
              color: userRole === 'parent' ? '#fff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            🛡️ Parent (Sarah)
          </button>
          <button
            onClick={() => setUserRole('teen')}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: userRole === 'teen' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
              color: userRole === 'teen' ? '#fff' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            🎧 Teen (Leo)
          </button>
        </div>

        {/* Action Button */}
        <button 
          onClick={onOpenNewModal} 
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <PlusCircle size={17} />
          New Dilemma / Scenario
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        maxWidth: 1280,
        margin: '12px auto 0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 2
      }}>
        {[
          { id: 'conflicts', label: 'Conflict & Decision Hub', icon: Scale },
          { id: 'chat', label: 'AI Mediator Room', icon: MessageSquare },
          { id: 'translator', label: 'Perspective Translator', icon: Sparkles },
          { id: 'agreements', label: 'Family Agreements', icon: FileCheck },
          { id: 'pulse', label: 'Daily Mood Pulse', icon: HeartHandshake },
          { id: 'insights', label: 'Pattern Analytics', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                borderBottom: isActive ? '2px solid #8b5cf6' : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} color={isActive ? '#a78bfa' : '#94a3b8'} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
