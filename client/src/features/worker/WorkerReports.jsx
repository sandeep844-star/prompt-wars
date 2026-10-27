import React, { useState } from 'react';
import { translations } from '../../lib/translations';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export default function WorkerReports({ grievances = [], lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [selectedCaseId, setSelectedCaseId] = useState(grievances[0]?.id || null);

  const selectedGrievance = grievances.find(g => g.id === selectedCaseId) || grievances[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="badge badge-success"><CheckCircle size={12} /> {t.statusResolved}</span>;
      case 'investigating':
        return <span className="badge badge-danger"><AlertCircle size={12} /> {t.statusInvestigating}</span>;
      case 'under_review':
        return <span className="badge badge-warning"><Clock size={12} /> {t.statusUnderReview}</span>;
      default:
        return <span className="badge badge-info"><Clock size={12} /> {t.statusSubmitted}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-950)' }}>
          {t.recentReports}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Transparent case status and audit trail for all submitted concerns.
        </p>
      </div>

      {grievances.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <FileText size={36} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-secondary)' }}>{t.noReportsYet}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'flex-start' }}>
          {/* List of cases */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {grievances.map((g) => {
              const isSelected = selectedGrievance?.id === g.id;
              return (
                <div
                  key={g.id}
                  className="card"
                  onClick={() => setSelectedCaseId(g.id)}
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--brand-700)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? '#FFFFFF' : 'var(--surface)',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-950)', fontSize: '1rem' }}>
                      {g.caseNumber}
                    </span>
                    {getStatusBadge(g.status)}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>
                    {g.description?.slice(0, 90)}{g.description?.length > 90 ? '...' : ''}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Category: <strong>{g.category?.toUpperCase()}</strong></span>
                    <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Case Timeline Detail Panel */}
          {selectedGrievance && (
            <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span className="badge badge-brand" style={{ marginBottom: '6px' }}>
                    {selectedGrievance.category?.toUpperCase()}
                  </span>
                  <h2 style={{ fontSize: '1.3rem', color: 'var(--brand-950)' }}>
                    {selectedGrievance.caseNumber}
                  </h2>
                </div>
                {getStatusBadge(selectedGrievance.status)}
              </div>

              {/* Description */}
              <div style={{ 
                backgroundColor: 'var(--surface-muted)', 
                padding: '14px', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '20px',
                fontSize: '0.95rem',
                lineHeight: 1.5
              }}>
                <strong>Submitted Statement:</strong>
                <p style={{ marginTop: '6px', color: 'var(--brand-950)' }}>
                  {selectedGrievance.description}
                </p>
              </div>

              {/* AI Summary note if available */}
              {selectedGrievance.aiSummary && (
                <div style={{
                  borderLeft: '3px solid var(--brand-600)',
                  paddingLeft: '12px',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)'
                }}>
                  {selectedGrievance.aiSummary}
                </div>
              )}

              {/* Resolution Note if resolved */}
              {selectedGrievance.resolutionNote && (
                <div style={{
                  backgroundColor: 'var(--success-bg)',
                  border: '1px solid var(--success)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem' }}>
                    <CheckCircle size={16} />
                    <span>Official Resolution Note</span>
                  </div>
                  <p style={{ marginTop: '6px', fontSize: '0.9rem', color: '#14532D', lineHeight: 1.5 }}>
                    {selectedGrievance.resolutionNote}
                  </p>
                </div>
              )}

              {/* Status Timeline */}
              <h3 style={{ fontSize: '1rem', color: 'var(--brand-950)', marginBottom: '16px' }}>
                {t.timeline}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                {(selectedGrievance.timeline || []).map((evt, idx) => (
                  <div key={evt.id || idx} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-100)',
                      color: 'var(--brand-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1, paddingBottom: '8px', borderBottom: idx < (selectedGrievance.timeline.length - 1) ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--brand-950)' }}>
                          {evt.toStatus ? evt.toStatus.replace('_', ' ').toUpperCase() : evt.eventType?.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {new Date(evt.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {evt.note}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--brand-700)', marginTop: '2px' }}>
                        Logged by: {evt.actorName} ({evt.actorRole})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
