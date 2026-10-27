import React, { useState } from 'react';
import { api } from '../../lib/api';
import { translations } from '../../lib/translations';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  UserCheck, 
  MessageSquare,
  Shield,
  Filter
} from 'lucide-react';

export default function AdminGrievances({ grievances = [], onRefresh, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState(grievances[0]?.id || null);

  // Status update modal / form state
  const [targetStatus, setTargetStatus] = useState('investigating');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Internal Note form state
  const [internalNote, setInternalNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const filtered = grievances.filter(g => {
    if (categoryFilter && g.category !== categoryFilter) return false;
    if (statusFilter && g.status !== statusFilter) return false;
    return true;
  });

  const selectedCase = grievances.find(g => g.id === selectedCaseId) || filtered[0];

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedCase) return;
    if (newStatus === 'resolved' && (!statusNote || statusNote.trim().length < 5)) {
      alert('Please provide a mandatory resolution note (at least 5 characters) before marking a case resolved.');
      return;
    }

    try {
      setUpdating(true);
      await api.updateGrievanceStatus(selectedCase.id, {
        toStatus: newStatus,
        note: statusNote || `Status changed to ${newStatus}.`
      });
      setStatusNote('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddInternalNote = async (e) => {
    e.preventDefault();
    if (!selectedCase || !internalNote.trim()) return;

    try {
      setAddingNote(true);
      await api.addGrievanceNote(selectedCase.id, internalNote.trim());
      setInternalNote('');
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to add note: ' + err.message);
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-950)' }}>
          Grievance Resolution Queue
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Investigate reported safety hazards, wage disputes, and staff concerns with an accountable audit trail.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
          <Filter size={16} /> Filters:
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            backgroundColor: '#FFFFFF',
            fontSize: '0.85rem'
          }}
        >
          <option value="">All Categories</option>
          <option value="safety">Safety Hazard</option>
          <option value="pay">Wage / Payment</option>
          <option value="hours">Hours / Overtime</option>
          <option value="harassment">Harassment</option>
          <option value="other">General</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            backgroundColor: '#FFFFFF',
            fontSize: '0.85rem'
          }}
        >
          <option value="">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
          Showing <strong>{filtered.length}</strong> of {grievances.length} cases
        </span>
      </div>

      {/* Two Column Layout: Case List & Detail Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'flex-start' }}>
        {/* Left: Case List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((g) => {
            const isSelected = selectedCase?.id === g.id;
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
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-950)' }}>{g.caseNumber}</span>
                  <span className={`badge ${
                    g.status === 'resolved' ? 'badge-success' :
                    g.status === 'investigating' ? 'badge-danger' :
                    g.status === 'under_review' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {g.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Worker: <strong>{g.workerName}</strong> • Priority: <span style={{ color: g.priority === 'high' ? 'var(--danger)' : 'inherit', fontWeight: 600 }}>{g.priority?.toUpperCase()}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {g.description?.slice(0, 90)}...
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Case Review & Actions Panel */}
        {selectedCase ? (
          <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge badge-brand" style={{ marginBottom: '6px' }}>
                  {selectedCase.category?.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-950)' }}>
                  {selectedCase.caseNumber}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Complainant: <strong>{selectedCase.workerName}</strong> ({selectedCase.visibility} report)
                </div>
              </div>

              <span className={`badge ${
                selectedCase.status === 'resolved' ? 'badge-success' :
                selectedCase.status === 'investigating' ? 'badge-danger' :
                selectedCase.status === 'under_review' ? 'badge-warning' : 'badge-info'
              }`}>
                {selectedCase.status?.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Submitted Statement */}
            <div style={{
              backgroundColor: 'var(--surface-muted)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              fontSize: '0.95rem',
              lineHeight: 1.5
            }}>
              <strong>Worker Statement:</strong>
              <p style={{ marginTop: '4px', color: 'var(--brand-950)' }}>{selectedCase.description}</p>
            </div>

            {selectedCase.aiSummary && (
              <div style={{
                borderLeft: '3px solid var(--brand-600)',
                paddingLeft: '12px',
                marginBottom: '20px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                {selectedCase.aiSummary}
              </div>
            )}

            {/* Status Transition Action Bar */}
            <div style={{
              backgroundColor: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--brand-950)', marginBottom: '10px' }}>
                Update Investigation Status
              </h3>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <button
                  type="button"
                  disabled={updating || selectedCase.status === 'under_review'}
                  onClick={() => handleUpdateStatus('under_review')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  Mark Under Review
                </button>
                <button
                  type="button"
                  disabled={updating || selectedCase.status === 'investigating'}
                  onClick={() => handleUpdateStatus('investigating')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                >
                  Mark Investigating
                </button>
                <button
                  type="button"
                  disabled={updating || selectedCase.status === 'resolved'}
                  onClick={() => handleUpdateStatus('resolved')}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px', backgroundColor: 'var(--success)' }}
                >
                  Mark Resolved
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Resolution or status update note (Mandatory when resolving)..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            {/* Case Timeline */}
            <h3 style={{ fontSize: '1rem', color: 'var(--brand-950)', marginBottom: '12px' }}>
              Chronological Audit Timeline
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {(selectedCase.timeline || []).map((evt, idx) => (
                <div key={evt.id || idx} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-100)',
                    color: 'var(--brand-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, paddingBottom: '6px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{evt.toStatus ? evt.toStatus.toUpperCase() : evt.eventType}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{new Date(evt.timestamp).toLocaleString()}</span>
                    </div>
                    <p style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{evt.note}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--brand-700)' }}>By {evt.actorName} ({evt.actorRole})</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Internal Note */}
            <form onSubmit={handleAddInternalNote} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add internal note to this investigation..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem'
                }}
              />
              <button
                type="submit"
                disabled={addingNote || !internalNote.trim()}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Send size={14} /> Add Note
              </button>
            </form>
          </div>
        ) : (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Select a case from the queue to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
