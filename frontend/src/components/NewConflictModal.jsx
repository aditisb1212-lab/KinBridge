import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Sparkles, 
  Shield, 
  Headphones, 
  Loader2,
  Sliders
} from 'lucide-react';

export default function NewConflictModal({ isOpen, onClose, onCreateConflict, onImportPreset, userRole }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Curfew & Social Life');
  const [description, setDescription] = useState('');
  const [initialPerspective, setInitialPerspective] = useState('');
  const [creatorRole, setCreatorRole] = useState(userRole === 'teen' ? 'teen' : 'parent');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Curfew & Social Life',
    'Screen Time & Tech',
    'Academics & Future',
    'Privacy & Trust',
    'Chores & Responsibilities',
    'Communication & Tone',
    'Dating & Relationships'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onCreateConflict({
      title,
      category,
      created_by_role: creatorRole,
      description,
      parent_perspective: creatorRole === 'parent' ? initialPerspective : '',
      teen_perspective: creatorRole === 'teen' ? initialPerspective : ''
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: 8, borderRadius: 10 }}>
              <PlusCircle size={22} color="#a78bfa" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem' }}>Raise a New Family Dilemma</h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Frame the topic respectfully to start grounded mediation
              </span>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost" style={{ padding: 6, borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Presets row */}
        <div style={{
          padding: '12px 16px',
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.04)',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
            Looking for inspiration? Load a realistic pre-configured scenario:
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => { onImportPreset(0); onClose(); }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              🚗 Driving
            </button>
            <button
              type="button"
              onClick={() => { onImportPreset(1); onClose(); }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              🎮 Gaming
            </button>
            <button
              type="button"
              onClick={() => { onImportPreset(2); onClose(); }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              🚪 Room Privacy
            </button>
          </div>
        </div>

        {/* Conflict Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Creator Role */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>
              WHO IS RAISING THIS TOPIC?
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setCreatorRole('parent')}
                className={`btn ${creatorRole === 'parent' ? 'btn-parent' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
              >
                <Shield size={15} /> Parent (Sarah)
              </button>
              <button
                type="button"
                onClick={() => setCreatorRole('teen')}
                className={`btn ${creatorRole === 'teen' ? 'btn-teen' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
              >
                <Headphones size={15} /> Teen (Leo)
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 600 }}>
              Topic / Dilemma Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 'Weekend Curfew for Friday Night Football' or 'Managing Gaming Screen Time'"
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 600 }}>
              Category
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Context / Background */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 600 }}>
              Background Context (What happened or what triggered this?)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the context without attacking or blaming..."
            />
          </div>

          {/* Initial Perspective */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', color: '#cbd5e1', marginBottom: 6, fontWeight: 600 }}>
              Your Perspective ({creatorRole === 'parent' ? 'Parent Feelings & Concerns' : 'Teen Feelings & Desires'})
            </label>
            <textarea
              rows={3}
              value={initialPerspective}
              onChange={(e) => setInitialPerspective(e.target.value)}
              placeholder={creatorRole === 'parent' ? "What is your main worry or expectation?" : "What do you want and why does it matter to you?"}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <PlusCircle size={16} />}
              Create Dilemma & Open Mediation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
