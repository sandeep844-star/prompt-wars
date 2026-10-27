import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  HardHat, 
  Calendar, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle,
  Eye
} from 'lucide-react';

export default function AdminWorkforce({ workers = [], organization }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(workers[0] || null);

  const filtered = workers.filter(w => 
    w.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.departmentOrSite?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.jobRole?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-950)' }}>
          Workforce Directory — {organization?.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage and inspect workers, assigned sites/departments, and wage configurations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search workers by name, role, or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'flex-start' }}>
        {/* Worker Table / Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((w) => {
            const isSelected = selectedWorker?.id === w.id;
            return (
              <div
                key={w.id}
                className="card"
                onClick={() => setSelectedWorker(w)}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--brand-700)' : '1px solid var(--border)',
                  backgroundColor: isSelected ? '#FFFFFF' : 'var(--surface)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand-950)', fontSize: '1.05rem' }}>
                    {w.displayName}
                  </span>
                  <span className="badge badge-success">
                    <CheckCircle size={10} /> Active
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--brand-800)', marginBottom: '4px' }}>
                  {w.jobRole} • <code>{w.id}</code>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Site: {w.departmentOrSite}</span>
                  <span>Rate: <strong>₹{w.baseRate}/{w.wageType}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Worker Detail Drawer */}
        {selectedWorker && (
          <div className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-brand" style={{ marginBottom: '6px' }}>
                  {organization?.industry?.toUpperCase()} WORKER
                </span>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-950)' }}>
                  {selectedWorker.displayName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Assigned Unit: <strong>{selectedWorker.departmentOrSite}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Standard Rate</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-700)' }}>
                  ₹{selectedWorker.baseRate}
                  <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/{selectedWorker.wageType}</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              backgroundColor: 'var(--surface-muted)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Contract Role</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedWorker.jobRole}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Overtime Hourly</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--brand-700)' }}>
                  ₹{selectedWorker.overtimeRate || 120}/hr
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Onboarding Date</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedWorker.joinedDate || '2025'}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <p>
                <strong>Dignity-first Principle:</strong> KaamSetu displays verified attendance, skill credentials, and transparent wage rates without invasive worker surveillance rankings or punitive scoring.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
