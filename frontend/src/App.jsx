import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConflictList from './components/ConflictList';
import ConflictDetail from './components/ConflictDetail';
import MediationRoom from './components/MediationRoom';
import PerspectiveTranslator from './components/PerspectiveTranslator';
import AgreementContract from './components/AgreementContract';
import MoodPulse from './components/MoodPulse';
import PatternInsights from './components/PatternInsights';
import NewConflictModal from './components/NewConflictModal';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState('all'); // 'all' | 'parent' | 'teen'
  const [activeTab, setActiveTab] = useState('conflicts');
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflictId, setSelectedConflictId] = useState(null);
  const [selectedConflictDetail, setSelectedConflictDetail] = useState(null);
  const [agreements, setAgreements] = useState([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isMediating, setIsMediating] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch initial conflicts & agreements
  useEffect(() => {
    loadConflicts();
    loadAgreements();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadConflicts = async () => {
    try {
      const res = await fetch('/api/conflicts');
      if (res.ok) {
        const data = await res.json();
        setConflicts(data);
      }
    } catch (err) {
      console.error('Failed to load conflicts:', err);
    }
  };

  const loadAgreements = async () => {
    try {
      const res = await fetch('/api/agreements');
      if (res.ok) {
        const data = await res.json();
        setAgreements(data);
      }
    } catch (err) {
      console.error('Failed to load agreements:', err);
    }
  };

  const handleSelectConflict = async (id) => {
    setSelectedConflictId(id);
    try {
      const res = await fetch(`/api/conflicts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedConflictDetail(data);
      }
    } catch (err) {
      console.error('Failed to load conflict detail:', err);
    }
  };

  const handleCreateConflict = async (conflictData) => {
    try {
      const res = await fetch('/api/conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conflictData)
      });
      if (res.ok) {
        const newConflict = await res.json();
        showToast(`Created new dilemma: "${newConflict.title}"`);
        await loadConflicts();
        handleSelectConflict(newConflict.id);
      }
    } catch (err) {
      console.error('Error creating conflict:', err);
      showToast('Failed to create conflict', 'error');
    }
  };

  const handleUpdatePerspective = async (conflictId, role, perspective) => {
    try {
      const res = await fetch(`/api/conflicts/${conflictId}/perspective`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, perspective })
      });
      if (res.ok) {
        showToast(`Updated ${role === 'parent' ? 'Parent' : 'Teen'} perspective!`);
        await loadConflicts();
        await handleSelectConflict(conflictId);
      }
    } catch (err) {
      console.error('Error updating perspective:', err);
      showToast('Failed to update perspective', 'error');
    }
  };

  const handleRunMediation = async (conflictId) => {
    setIsMediating(true);
    try {
      const res = await fetch(`/api/mediation/${conflictId}`, {
        method: 'POST'
      });
      if (res.ok) {
        showToast('AI Mediation completed! Grounded decision generated.');
        await loadConflicts();
        await handleSelectConflict(conflictId);
      } else {
        showToast('Mediation request encountered an issue', 'error');
      }
    } catch (err) {
      console.error('Error running mediation:', err);
      showToast('Mediation service error', 'error');
    } finally {
      setIsMediating(false);
    }
  };

  const handleCreateAgreement = async (conflict, mediation) => {
    try {
      const parentPledge = mediation.parent_commitments?.[0] || 'I commit to supporting your autonomy with agreed boundaries.';
      const teenPledge = mediation.teen_commitments?.[0] || 'I commit to proactive check-ins and keeping my word.';

      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conflict_id: conflict.id,
          title: `Mutual Agreement: ${conflict.title}`,
          parent_pledge: parentPledge,
          teen_pledge: teenPledge,
          safety_boundary: 'Adhere to all agreed check-in times and honest communication.',
          reward_or_privilege: 'Continued trust and expanded privileges based on mutual respect.',
          check_in_date: mediation.review_period || '2 Weeks'
        })
      });

      if (res.ok) {
        showToast('Drafted new Family Agreement Pact! Both parties can now sign.');
        await loadAgreements();
        await loadConflicts();
        setActiveTab('agreements');
      }
    } catch (err) {
      console.error('Error creating agreement:', err);
      showToast('Failed to generate agreement', 'error');
    }
  };

  const handleSignAgreement = async (agreementId, role) => {
    try {
      const res = await fetch(`/api/agreements/${agreementId}/sign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        showToast(`Agreement ratified by ${role === 'parent' ? 'Sarah (Mom)' : 'Leo (Teen)'}! ✍️`);
        await loadAgreements();
      }
    } catch (err) {
      console.error('Error signing agreement:', err);
    }
  };

  const handleImportPreset = async (index) => {
    try {
      const res = await fetch('/api/scenarios/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
      if (res.ok) {
        const imported = await res.json();
        showToast(`Loaded scenario: "${imported.title}"`);
        await loadConflicts();
        handleSelectConflict(imported.id);
        setActiveTab('conflicts');
      }
    } catch (err) {
      console.error('Preset import error:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.9rem',
          fontWeight: 600,
          animation: 'fadeIn 0.25s ease-out'
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenNewModal={() => setIsNewModalOpen(true)}
      />

      {/* Viewport Content */}
      <main className="main-content">
        {activeTab === 'conflicts' && (
          selectedConflictId && selectedConflictDetail ? (
            <ConflictDetail
              conflict={selectedConflictDetail}
              onBack={() => {
                setSelectedConflictId(null);
                setSelectedConflictDetail(null);
                loadConflicts();
              }}
              userRole={userRole}
              onUpdatePerspective={handleUpdatePerspective}
              onRunMediation={handleRunMediation}
              onOpenChat={(id) => {
                setSelectedConflictId(id);
                setActiveTab('chat');
              }}
              onCreateAgreement={handleCreateAgreement}
              isMediating={isMediating}
            />
          ) : (
            <ConflictList
              conflicts={conflicts}
              selectedConflict={selectedConflictDetail}
              onSelectConflict={handleSelectConflict}
              onOpenNewModal={() => setIsNewModalOpen(true)}
              userRole={userRole}
              onImportPreset={handleImportPreset}
            />
          )
        )}

        {activeTab === 'chat' && (
          <MediationRoom
            conflicts={conflicts}
            activeConflictId={selectedConflictId}
            onSelectConflict={handleSelectConflict}
            userRole={userRole}
            onOpenTranslator={() => setActiveTab('translator')}
          />
        )}

        {activeTab === 'translator' && (
          <PerspectiveTranslator
            userRole={userRole}
            onSendToChat={(text) => {
              setActiveTab('chat');
            }}
          />
        )}

        {activeTab === 'agreements' && (
          <AgreementContract
            agreements={agreements}
            onSignAgreement={handleSignAgreement}
            userRole={userRole}
          />
        )}

        {activeTab === 'pulse' && (
          <MoodPulse userRole={userRole} />
        )}

        {activeTab === 'insights' && (
          <PatternInsights />
        )}
      </main>

      {/* New Conflict Modal */}
      <NewConflictModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreateConflict={handleCreateConflict}
        onImportPreset={handleImportPreset}
        userRole={userRole}
      />
    </div>
  );
}
