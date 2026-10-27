import React, { useState } from 'react';
import { api } from '../lib/api';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function DemoDataBanner({ onReset }) {
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (!window.confirm('Reset all demo data back to the original baseline?')) return;
    try {
      setResetting(true);
      await api.resetDemoData();
      if (onReset) onReset();
      window.location.reload();
    } catch (err) {
      alert('Failed to reset: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#102A43',
      color: '#CCFBF1',
      fontSize: '0.8rem',
      padding: '6px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      borderBottom: '1px solid #164E63'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldCheck size={16} color="#0D9488" />
        <span>
          <strong>KaamSetu Hackathon Prototype</strong> — Synthetic records compliant with SDG 8 (Decent Work & Economic Growth). No real wage data stored.
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleReset}
          disabled={resetting}
          style={{
            background: 'rgba(204, 251, 241, 0.12)',
            color: '#CCFBF1',
            border: '1px solid rgba(204, 251, 241, 0.3)',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
          title="Restore original demo seed data"
        >
          <RefreshCw size={12} className={resetting ? 'spin' : ''} />
          {resetting ? 'Resetting...' : 'Reset Demo'}
        </button>
      </div>
    </div>
  );
}
