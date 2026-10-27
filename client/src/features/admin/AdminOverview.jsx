import React, { useState } from 'react';
import { api } from '../../lib/api';
import { translations } from '../../lib/translations';
import { 
  Users, 
  AlertTriangle, 
  FileText, 
  IndianRupee, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  ArrowUpRight,
  ChevronRight,
  Info
} from 'lucide-react';

export default function AdminOverview({ summary, onRefresh, onNavigate, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [reviewingAlertId, setReviewingAlertId] = useState(null);

  const metrics = summary?.metrics || {};
  const alerts = summary?.alerts || [];
  const openQueue = summary?.openGrievancesQueue || [];
  const discrepancies = summary?.discrepancyQueue || [];

  const handleMarkAlertReviewed = async (alertId) => {
    try {
      setReviewingAlertId(alertId);
      await api.markAlertReviewed(alertId);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error marking alert reviewed: ' + err.message);
    } finally {
      setReviewingAlertId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner with Deep Dashboard Gradient */}
      <div 
        className="card"
        style={{
          background: 'var(--gradient-dashboard)',
          color: '#FFFFFF',
          padding: '24px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-brand">{summary?.organization?.industry?.toUpperCase()}</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{summary?.organization?.name}</span>
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#FFFFFF', marginBottom: '4px' }}>
              {t.overviewTitle}
            </h1>
            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
              Explainable workforce risk detection, proactive overtime tracking, and grievance resolution.
            </p>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="btn"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)',
              fontSize: '0.85rem'
            }}
          >
            Configure Industry Settings →
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.activeWorkers}</span>
            <Users size={18} color="var(--brand-700)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--brand-950)', margin: '8px 0' }}>
            {metrics.activeWorkers || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
            ✓ Verified shifts active today
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.openCases}</span>
            <FileText size={18} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--brand-950)', margin: '8px 0' }}>
            {metrics.openGrievancesCount || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Pending investigation/review
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.discrepancies}</span>
            <IndianRupee size={18} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--warning)', margin: '8px 0' }}>
            {metrics.discrepanciesCount || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Flagged disbursement gaps
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.pendingAlerts}</span>
            <ShieldAlert size={18} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--danger)', margin: '8px 0' }}>
            {metrics.pendingAlertsCount || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Actionable rule triggers
          </div>
        </div>
      </div>

      {/* Workforce Risk Radar Feed - Explainable Alerts */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--brand-950)' }}>
              Workforce Risk Alerts
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Every alert is explainable and displays the rule threshold that triggered it.
            </p>
          </div>
          <span className="badge badge-brand">
            {alerts.filter(a => !a.reviewed).length} Pending Review
          </span>
        </div>

        {alerts.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>No active alerts flagged.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  border: alert.reviewed ? '1px solid var(--border)' : '1px solid #FCA5A5',
                  backgroundColor: alert.reviewed ? 'var(--surface-muted)' : '#FFF5F5',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={18} color={alert.reviewed ? 'var(--text-secondary)' : 'var(--danger)'} />
                    <span style={{ fontWeight: 700, color: 'var(--brand-950)', fontSize: '1rem' }}>
                      {alert.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${alert.severity === 'high' ? 'badge-danger' : 'badge-warning'}`}>
                      {alert.severity?.toUpperCase()}
                    </span>
                    {alert.reviewed ? (
                      <span className="badge badge-success">
                        <CheckCircle size={10} /> {t.reviewed} by {alert.reviewedBy}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkAlertReviewed(alert.id)}
                        disabled={reviewingAlertId === alert.id}
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        {reviewingAlertId === alert.id ? 'Reviewing...' : t.markReviewed}
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {alert.description}
                </p>

                {/* Explainable Rationale */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  lineHeight: 1.4
                }}>
                  <div style={{ color: 'var(--brand-800)', fontWeight: 600 }}>
                    {t.flaggedReason} {alert.ruleExplanation}
                  </div>
                  {alert.suggestedAction && (
                    <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {t.suggestedAction} <strong>{alert.suggestedAction}</strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <Info size={14} />
          <span>Notice: Risk radar alerts provide investigative awareness and do not constitute disciplinary action.</span>
        </div>
      </div>

      {/* Two Column Layout: Open Grievances Queue & Discrepancies Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Open Grievances Queue */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--brand-950)' }}>
              Priority Grievance Queue
            </h3>
            <button
              onClick={() => onNavigate('grievances')}
              style={{ color: 'var(--brand-700)', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Manage ({openQueue.length}) →
            </button>
          </div>

          {openQueue.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No open grievances pending.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {openQueue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('grievances')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.caseNumber}</span>
                    <span className="badge badge-warning">{item.status?.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Worker: {item.workerName} • Category: {item.category?.toUpperCase()}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {item.description?.slice(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Discrepancy Queue */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--brand-950)' }}>
              Wage Discrepancy Audits
            </h3>
            <button
              onClick={() => onNavigate('workforce')}
              style={{ color: 'var(--brand-700)', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Inspect →
            </button>
          </div>

          {discrepancies.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All disbursements match expected calculations.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {discrepancies.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--warning)',
                    backgroundColor: 'var(--warning-bg)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-950)', fontSize: '0.9rem' }}>
                      {item.workerName}
                    </span>
                    <span className="badge badge-warning">Shortfall</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#78350F' }}>
                    Expected: <strong>₹{item.expectedNetPay?.toLocaleString()}</strong> | Recorded: <strong>₹{item.recordedPayment?.toLocaleString()}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600, marginTop: '4px' }}>
                    Discrepancy: ₹{Math.abs(item.difference)?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
