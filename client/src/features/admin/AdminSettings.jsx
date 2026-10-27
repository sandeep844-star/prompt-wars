import React, { useState } from 'react';
import { api } from '../../lib/api';
import { 
  Building2, 
  GraduationCap, 
  Settings, 
  Save, 
  CheckCircle, 
  Sliders, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function AdminSettings({ organization, onRefresh }) {
  const [primaryWageType, setPrimaryWageType] = useState(organization?.settings?.primaryWageType || 'daily');
  const [defaultDailyRate, setDefaultDailyRate] = useState(organization?.settings?.defaultDailyRate || 600);
  const [defaultOvertimeRate, setDefaultOvertimeRate] = useState(organization?.settings?.defaultOvertimeRate || 120);
  const [overtimeThreshold, setOvertimeThreshold] = useState(organization?.settings?.overtimeAlertThresholdHours || 10);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!organization) return;
    try {
      setSaving(true);
      setSuccess(false);
      await api.updateOrgSettings(organization.id, {
        primaryWageType,
        defaultDailyRate: Number(defaultDailyRate),
        defaultOvertimeRate: Number(defaultOvertimeRate),
        overtimeAlertThresholdHours: Number(overtimeThreshold)
      });
      setSuccess(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const isConstruction = organization?.industry === 'construction';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-brand">P0 Multi-Industry Architecture</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-950)' }}>
          Industry Configuration — {organization?.name}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configure dynamic rules, shift thresholds, and wage templates for {organization?.industry?.toUpperCase()}.
        </p>
      </div>

      {success && (
        <div style={{
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={18} />
          <span>Industry parameters updated successfully!</span>
        </div>
      )}

      {/* Two Column Layout: Settings Form & Industry Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Settings Form */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sliders size={20} color="var(--brand-700)" />
            <h2 style={{ fontSize: '1.2rem', color: 'var(--brand-950)' }}>
              Operational Thresholds
            </h2>
          </div>

          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                Primary Wage Structure
              </label>
              <select
                value={primaryWageType}
                onChange={(e) => setPrimaryWageType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                <option value="daily">Daily Wage (Standard in Construction)</option>
                <option value="monthly">Monthly Fixed (Standard in Institutions/Colleges)</option>
                <option value="hourly">Hourly Shifts</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                  Standard Daily Base (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={defaultDailyRate}
                  onChange={(e) => setDefaultDailyRate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                  Overtime Rate (₹/hr)
                </label>
                <input
                  type="number"
                  min="0"
                  value={defaultOvertimeRate}
                  onChange={(e) => setDefaultOvertimeRate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                Fatigue Overtime Alert Threshold (Weekly Hours)
              </label>
              <input
                type="number"
                min="1"
                value={overtimeThreshold}
                onChange={(e) => setOvertimeThreshold(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.9rem'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                When any worker exceeds this threshold, Risk Radar triggers an explainable alert.
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ marginTop: '8px' }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </form>
        </div>

        {/* Dynamic Multi-Industry Comparison Explanation */}
        <div className="card" style={{ padding: '24px', backgroundColor: 'var(--surface-muted)' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--brand-950)', marginBottom: '14px' }}>
            Multi-Industry Adaptability
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: isConstruction ? '2px solid var(--brand-700)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--brand-950)' }}>
                <Building2 size={18} color="var(--brand-700)" />
                <span>Construction Configuration</span>
              </div>
              <ul style={{ margin: '8px 0 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>Sites: Sector 7 Viaduct, Block C Residential, Foundations</li>
                <li>Wage: Daily rates with hourly overtime multipliers</li>
                <li>Grievance Focus: Scaffolding, fall protection, protective PPE gear</li>
                <li>Fatigue threshold: 10 hrs/week</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              border: !isConstruction ? '2px solid var(--brand-700)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--brand-950)' }}>
                <GraduationCap size={18} color="var(--brand-700)" />
                <span>College / University Configuration</span>
              </div>
              <ul style={{ margin: '8px 0 0 20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>Departments: Facilities & Maintenance, Hostels, Lab Operations</li>
                <li>Wage: Monthly base salaries with shift allowances</li>
                <li>Grievance Focus: Ventilation, chemical lab fumes, night mess shifts</li>
                <li>Fatigue threshold: 12 hrs/week</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
