import React from 'react';
import { translations } from '../../lib/translations';
import { 
  CalendarCheck, 
  Clock, 
  QrCode, 
  CheckCircle, 
  Calendar,
  Layers
} from 'lucide-react';

export default function WorkerAttendance({ attendance = [], lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const currentRecord = attendance[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-950)' }}>
          My Attendance & Shifts
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Verified shift records recorded via on-site biometric and QR kiosks.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Days Worked
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--brand-950)', margin: '4px 0' }}>
            {currentRecord?.regularDays || 0} Days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Regular hours: {currentRecord?.regularHours || 0} hrs
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Approved Overtime
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--brand-700)', margin: '4px 0' }}>
            {currentRecord?.approvedOvertimeHours || 0} Hours
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Logged by supervisor
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Approved Leaves
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0' }}>
            {currentRecord?.leaveDays || 0} Days
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Recorded rest days
          </div>
        </div>
      </div>

      {/* Date-wise Shift Log */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--brand-950)' }}>
            Shift Verification Log
          </h2>
          <span className="badge badge-brand">
            Source: {currentRecord?.source?.replace('_', ' ').toUpperCase() || 'KIOSK'}
          </span>
        </div>

        {currentRecord?.shiftDetails && currentRecord.shiftDetails.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentRecord.shiftDetails.map((shift, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface-muted)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={18} color="var(--brand-700)" />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--brand-950)' }}>
                      {new Date(shift.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                    {shift.note && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--brand-700)' }}>
                        Note: {shift.note}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '0.9rem' }}>
                    <strong>{shift.regularHours} hrs</strong> regular
                    {shift.overtimeHours > 0 && (
                      <span style={{ color: 'var(--brand-700)', marginLeft: '8px' }}>
                        + <strong>{shift.overtimeHours} hrs</strong> OT
                      </span>
                    )}
                  </div>
                  <span className="badge badge-success">
                    <CheckCircle size={10} /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Detailed daily punch breakdown is archived. Total aggregate: {currentRecord?.regularDays} shifts completed.
          </p>
        )}
      </div>
    </div>
  );
}
