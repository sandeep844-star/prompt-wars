import React from 'react';
import { translations } from '../../lib/translations';
import { 
  IndianRupee, 
  AlertTriangle, 
  CalendarCheck, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  Mic, 
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function WorkerHome({ 
  user, 
  organization, 
  workerProfile, 
  payRecords = [], 
  attendance = [], 
  grievances = [], 
  onNavigate,
  lang = 'en' 
}) {
  const t = translations[lang] || translations.en;
  const latestPay = payRecords[0];
  const latestGrievance = grievances[0];
  const latestAttendance = attendance[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome Card with Worker Welcome Gradient */}
      <div 
        className="card" 
        style={{
          background: 'var(--gradient-welcome)',
          borderColor: 'var(--brand-100)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-brand">{organization?.industry?.toUpperCase() || 'ORGANIZATION'}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {workerProfile?.departmentOrSite || 'Site Active'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--brand-950)', marginBottom: '4px' }}>
              {t.workerGreeting}, {user?.displayName}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Role: <strong>{workerProfile?.jobRole || user?.title}</strong> • ID: <code>{workerProfile?.id || user?.workerId}</code>
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.8)', 
            padding: '8px 16px', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              {t.todaysAttendance}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 700, fontSize: '0.95rem' }}>
              <CalendarCheck size={16} />
              <span>{t.statusPresent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons - Big, Accessible Touch Targets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <button
          onClick={() => onNavigate('pay')}
          style={{
            background: 'var(--gradient-primary)',
            color: '#FFFFFF',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <IndianRupee size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t.viewMyPay}</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                {latestPay ? `Period: ${latestPay.periodLabel || 'Current Cycle'}` : 'Inspect wage arithmetic'}
              </div>
            </div>
          </div>
          <ArrowRight size={22} />
        </button>

        <button
          onClick={() => onNavigate('safevoice')}
          style={{
            background: 'var(--surface)',
            color: 'var(--brand-950)',
            border: '2px solid var(--brand-700)',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-800)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <Mic size={28} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t.reportConcern}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Speak or type safety & wage issues
              </div>
            </div>
          </div>
          <ChevronRight size={22} color="var(--brand-700)" />
        </button>
      </div>

      {/* Pay Summary Card with Discrepancy Highlight */}
      {latestPay && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IndianRupee size={20} color="var(--brand-700)" />
              {t.expectedPayThisPeriod}
            </h2>
            {latestPay.status === 'discrepancy_flagged' ? (
              <span className="badge badge-warning">
                <AlertTriangle size={12} /> {t.differenceFlagged}
              </span>
            ) : (
              <span className="badge badge-success">Verified Match</span>
            )}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '16px',
            backgroundColor: 'var(--surface-muted)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.netExpected}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--brand-950)' }}>
                ₹{latestPay.expectedNetPay?.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.recordedPayment}</div>
              <div style={{ 
                fontSize: '1.6rem', 
                fontWeight: 700, 
                color: latestPay.recordedPayment < latestPay.expectedNetPay ? 'var(--warning)' : 'var(--success)' 
              }}>
                ₹{latestPay.recordedPayment?.toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Regular Shifts</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>
                {latestPay.regularUnits} {latestPay.wageType === 'daily' ? 'Days' : 'Units'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Approved Overtime</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--brand-700)' }}>
                {latestPay.approvedOvertimeHours || 0} Hours
              </div>
            </div>
          </div>

          {latestPay.recordedPayment < latestPay.expectedNetPay && (
            <div style={{
              backgroundColor: 'var(--warning-bg)',
              border: '1px solid var(--warning)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} color="var(--warning)" />
                <span style={{ fontSize: '0.9rem', color: '#78350F' }}>
                  Recorded payment is <strong>₹{(latestPay.expectedNetPay - latestPay.recordedPayment).toLocaleString()}</strong> lower than expected calculation.
                </span>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                onClick={() => onNavigate('pay')}
              >
                Inspect & Flag Discrepancy
              </button>
            </div>
          )}
        </div>
      )}

      {/* Latest Grievance / Case Status */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--brand-700)" />
            {t.recentReports}
          </h2>
          <button 
            onClick={() => onNavigate('reports')}
            style={{ color: 'var(--brand-700)', fontWeight: 600, fontSize: '0.85rem' }}
          >
            View All ({grievances.length}) →
          </button>
        </div>

        {latestGrievance ? (
          <div style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--brand-950)' }}>
                {latestGrievance.caseNumber}
              </span>
              <span className={`badge ${
                latestGrievance.status === 'resolved' ? 'badge-success' :
                latestGrievance.status === 'investigating' ? 'badge-danger' :
                latestGrievance.status === 'under_review' ? 'badge-warning' : 'badge-info'
              }`}>
                {latestGrievance.status?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {latestGrievance.description}
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
              <span>Category: <strong>{latestGrievance.category?.toUpperCase()}</strong></span>
              <span>Updated: <strong>{new Date(latestGrievance.updatedAt || latestGrievance.createdAt).toLocaleDateString()}</strong></span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
            <p>{t.noReportsYet}</p>
          </div>
        )}
      </div>
    </div>
  );
}
