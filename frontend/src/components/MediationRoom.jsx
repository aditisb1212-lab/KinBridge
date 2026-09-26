import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Shield, 
  Headphones, 
  MessageSquare, 
  HelpCircle, 
  Volume2, 
  RefreshCw,
  Loader2,
  Smile,
  CheckCircle2
} from 'lucide-react';

export default function MediationRoom({ 
  conflicts, 
  activeConflictId, 
  onSelectConflict, 
  userRole,
  onOpenTranslator
}) {
  const [currentConflictId, setCurrentConflictId] = useState(activeConflictId || (conflicts[0] ? conflicts[0].id : ''));
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState(userRole === 'teen' ? 'teen' : 'parent');
  const [isLoading, setIsLoading] = useState(false);
  const [isIntervening, setIsIntervening] = useState(false);
  const messagesEndRef = useRef(null);

  const selectedConflict = conflicts.find(c => c.id === currentConflictId) || conflicts[0];

  useEffect(() => {
    if (userRole === 'teen') setActiveSpeaker('teen');
    if (userRole === 'parent') setActiveSpeaker('parent');
  }, [userRole]);

  useEffect(() => {
    if (currentConflictId) {
      fetchMessages(currentConflictId);
    }
  }, [currentConflictId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (conflictId) => {
    try {
      const res = await fetch(`/api/chat/${conflictId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error loading chat:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !currentConflictId) return;

    const senderName = activeSpeaker === 'parent' ? 'Sarah (Mom)' : 'Leo (Teen)';
    const textToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/chat/${currentConflictId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_role: activeSpeaker,
          sender_name: senderName,
          message: textToSend,
          trigger_mediator: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => {
          const next = [...prev, data.userMessage];
          if (data.mediatorMessage) next.push(data.mediatorMessage);
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediatorIntervention = async () => {
    if (!currentConflictId) return;
    setIsIntervening(true);

    try {
      const res = await fetch(`/api/chat/${currentConflictId}/step-in`, {
        method: 'POST'
      });
      if (res.ok) {
        const mediatorMsg = await res.json();
        setMessages(prev => [...prev, mediatorMsg]);
      }
    } catch (err) {
      console.error('Intervention error:', err);
    } finally {
      setIsIntervening(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, minHeight: '75vh' }} className="animate-fade-in">
      {/* Sidebar: Conflict selector & guidelines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={16} color="#8b5cf6" /> Mediation Sessions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {conflicts.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setCurrentConflictId(c.id);
                  if (onSelectConflict) onSelectConflict(c.id);
                }}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: '0.84rem',
                  border: '1px solid ' + (c.id === currentConflictId ? '#8b5cf6' : 'rgba(255, 255, 255, 0.06)'),
                  background: c.id === currentConflictId ? 'rgba(139, 92, 246, 0.18)' : 'rgba(15, 23, 42, 0.4)',
                  color: c.id === currentConflictId ? '#fff' : '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Mediation Ground Rules */}
        <div className="glass-panel" style={{ padding: '18px', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#34d399', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={15} /> Safe Space Rules
          </h4>
          <ul style={{ fontSize: '0.78rem', color: '#cbd5e1', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>No yelling, interrupting, or door-slamming words.</li>
            <li>Parent: express concern rather than authority.</li>
            <li>Teen: express desire rather than defiance.</li>
            <li>KinBridge AI steps in to keep things supportive.</li>
          </ul>

          <button
            onClick={() => onOpenTranslator()}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: 14, fontSize: '0.78rem', padding: '6px 10px' }}
          >
            🔄 Translate Angry Thought First
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 2 }}>
              {selectedConflict?.title || 'Family Mediation Room'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#94a3b8' }}>
              <span className="badge badge-mediator" style={{ fontSize: '0.68rem' }}>AI Facilitator Active</span>
              <span>• Both voices are heard and respected equally</span>
            </div>
          </div>

          {/* Ask Mediator to Step In */}
          <button
            onClick={handleMediatorIntervention}
            disabled={isIntervening}
            className="btn btn-mediator"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            {isIntervening ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            Ask AI to De-Escalate & Summarize
          </button>
        </div>

        {/* Message Log */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxHeight: '52vh'
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: '#64748b' }}>
              <MessageSquare size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <p>No messages yet in this mediation room.</p>
              <p style={{ fontSize: '0.8rem' }}>Say hello or share how this situation is making you feel.</p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isAi = m.sender_role === 'ai_mediator';
              const isParent = m.sender_role === 'parent';
              const isTeen = m.sender_role === 'teen';

              return (
                <div
                  key={m.id || idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'center' : (isTeen ? 'flex-end' : 'flex-start'),
                    maxWidth: '100%'
                  }}
                >
                  {/* Sender Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 4,
                    fontSize: '0.75rem',
                    color: isAi ? '#34d399' : (isTeen ? '#c4b5fd' : '#fb923c')
                  }}>
                    {isParent && <Shield size={13} />}
                    {isTeen && <Headphones size={13} />}
                    {isAi && <Sparkles size={13} />}
                    <span style={{ fontWeight: 600 }}>{m.sender_name || m.sender_role}</span>
                    <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                      {new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: isAi ? '85%' : '75%',
                    padding: '12px 18px',
                    borderRadius: 16,
                    fontSize: '0.92rem',
                    lineHeight: 1.55,
                    background: isAi 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 78, 59, 0.4))'
                      : isTeen
                      ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                      : 'linear-gradient(135deg, #ea580c, #c2410c)',
                    border: isAi ? '1px solid rgba(16, 185, 129, 0.4)' : 'none',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          {/* Active Persona Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>SPEAKING AS:</span>
            <button
              onClick={() => setActiveSpeaker('parent')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: '0.78rem',
                border: '1px solid ' + (activeSpeaker === 'parent' ? '#f97316' : 'rgba(255, 255, 255, 0.1)'),
                background: activeSpeaker === 'parent' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                color: activeSpeaker === 'parent' ? '#fb923c' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <Shield size={13} /> Parent (Sarah)
            </button>
            <button
              onClick={() => setActiveSpeaker('teen')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: '0.78rem',
                border: '1px solid ' + (activeSpeaker === 'teen' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'),
                background: activeSpeaker === 'teen' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                color: activeSpeaker === 'teen' ? '#c4b5fd' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <Headphones size={13} /> Teen (Leo)
            </button>
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={activeSpeaker === 'parent' ? "Express your concern or boundaries calmly..." : "Express what you need and what you're willing to do..."}
              disabled={isLoading}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={`btn ${activeSpeaker === 'parent' ? 'btn-parent' : 'btn-teen'}`}
              style={{ padding: '10px 20px' }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
