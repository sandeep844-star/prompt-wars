import React, { useState } from 'react';
import { api } from '../../lib/api';
import { translations } from '../../lib/translations';
import { 
  Award, 
  ShieldCheck, 
  Share2, 
  QrCode, 
  CheckCircle, 
  Calendar,
  Lock,
  Unlock
} from 'lucide-react';

export default function WorkerSkills({ skills = [], onRefresh, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [togglingId, setTogglingId] = useState(null);

  const handleToggleConsent = async (skill) => {
    try {
      setTogglingId(skill.id);
      await api.toggleSkillConsent(skill.id, !skill.isPublicConsentGiven);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error updating consent: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-brand">P1 Stretch Goal</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-950)' }}>
          {t.skillsTitle} — Portable Verified Credentials
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t.skillsSubtitle} Your skills remain portable across contractors and employers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className="card" 
            style={{ 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderTop: '4px solid var(--brand-700)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge badge-success">
                  <ShieldCheck size={12} /> {skill.verificationStatus?.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {skill.category}
                </span>
              </div>

              <h2 style={{ fontSize: '1.2rem', color: 'var(--brand-950)', marginBottom: '6px' }}>
                {skill.skillName}
              </h2>

              <p style={{ fontSize: '0.85rem', color: 'var(--brand-800)', marginBottom: '12px' }}>
                Issued by: <strong>{skill.issuer}</strong>
              </p>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Verified on: {skill.issueDate} • Valid until: {skill.expiryDate}
              </div>

              {skill.verifierNote && (
                <div style={{ 
                  backgroundColor: 'var(--surface-muted)', 
                  padding: '8px 12px', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px'
                }}>
                  Note: {skill.verifierNote}
                </div>
              )}
            </div>

            {/* Explicit Consent Control */}
            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                {skill.isPublicConsentGiven ? (
                  <>
                    <Unlock size={14} color="var(--success)" />
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Publicly Shareable</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} color="var(--text-secondary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Private Only</span>
                  </>
                )}
              </div>

              <button
                onClick={() => handleToggleConsent(skill)}
                disabled={togglingId === skill.id}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                {skill.isPublicConsentGiven ? 'Revoke Consent' : 'Enable Sharing'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
