import React, { useState } from 'react';
import { api } from '../../lib/api';
import { translations } from '../../lib/translations';
import { 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  FileWarning, 
  Calculator,
  ArrowRight
} from 'lucide-react';

export default function WorkerPay({ 
  payRecords = [], 
  onRefresh, 
  onNavigate,
  lang = 'en' 
}) {
  const t = translations[lang] || translations.en;
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const [expandedExplanation, setExpandedExplanation] = useState(false);
  const [flagging, setFlagging] = useState(false);
  const [flagSuccessMessage, setFlagSuccessMessage] = useState('');

  const currentPay = payRecords[selectedRecordIndex] || payRecords[0];

  const handleFlagDiscrepancy = async () => {
    if (!currentPay) return;
    try {
      setFlagging(true);
      const res = await api.flagPayDiscrepancy(
        currentPay.id,
        `Wage discrepancy for ${currentPay.periodLabel}. Expected ₹${currentPay.expectedNetPay} but recorded payment was ₹${currentPay.recordedPayment}.`
      );
      setFlagSuccessMessage(`Discrepancy successfully lodged as Case #${res.grievance?.caseNumber || 'KS-GEN'}. You can track its investigation under My Reports.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Error flagging discrepancy: ' + err.message);
    } finally {
      setFlagging(false);
    }
  };

  if (!currentPay) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No pay records available for this cycle.</p>
      </div>
    );
  }

  const diff = currentPay.recordedPayment - currentPay.expectedNetPay;
  const hasShortfall = diff < 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Period Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--brand-950)' }}>
            FairPay — Transparent Wage Breakdown
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Deterministic line-by-line wage calculations based on verified shifts.
          </p>
        </div>

        {payRecords.length > 1 && (
          <select
            value={selectedRecordIndex}
            onChange={(e) => setSelectedRecordIndex(Number(e.target.value))}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: '#FFFFFF',
              fontWeight: 600
            }}
          >
            {payRecords.map((rec, idx) => (
              <option key={rec.id} value={idx}>
                {rec.periodLabel || `Period ${idx + 1}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Flag Success Alert */}
      {flagSuccessMessage && (
        <div style={{
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success)',
          border: '1px solid var(--success)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={20} />
          <div style={{ flex: 1, fontSize: '0.95rem' }}>{flagSuccessMessage}</div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={() => onNavigate('reports')}
          >
            View Cases
          </button>
        </div>
      )}

      {/* Expected vs Recorded Net Pay Hero Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Expected Net Pay Card */}
        <div className="card" style={{
          background: 'var(--gradient-primary)',
          color: '#FFFFFF',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', opacity: 0.9, fontWeight: 600 }}>
              Expected Net Entitlement
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 700, margin: '8px 0' }}>
              ₹{currentPay.expectedNetPay?.toLocaleString()}
            </div>
            <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>
              Calculated deterministically from {currentPay.regularUnits} shifts + {currentPay.approvedOvertimeHours || 0} overtime hours.
            </p>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', opacity: 0.8 }}>
            <Calculator size={14} />
            <span>Algorithm: {currentPay.calculationVersion || '1.0.0-deterministic'}</span>
          </div>
        </div>

        {/* Recorded Disbursement Card */}
        <div className="card" style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          border: hasShortfall ? '2px solid var(--warning)' : '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Employer Recorded Disbursement
              </span>
              {hasShortfall ? (
                <span className="badge badge-warning">Shortfall Detected</span>
              ) : (
                <span className="badge badge-success">Payment Matched</span>
              )}
            </div>

            <div style={{ 
              fontSize: '2.4rem', 
              fontWeight: 700, 
              margin: '8px 0',
              color: hasShortfall ? 'var(--warning)' : 'var(--brand-950)'
            }}>
              ₹{currentPay.recordedPayment?.toLocaleString()}
            </div>

            {hasShortfall ? (
              <p style={{ fontSize: '0.85rem', color: '#B45309', lineHeight: 1.4 }}>
                The recorded payment is <strong>₹{Math.abs(diff).toLocaleString()}</strong> lower than the expected wage calculation.
              </p>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
                Recorded payout matches verified attendance and overtime hours.
              </p>
            )}
          </div>

          {hasShortfall && currentPay.status !== 'discrepancy_flagged' && !flagSuccessMessage && (
            <button
              onClick={handleFlagDiscrepancy}
              disabled={flagging}
              className="btn btn-primary"
              style={{
                marginTop: '16px',
                backgroundColor: 'var(--warning)',
                color: '#FFFFFF'
              }}
            >
              <FileWarning size={16} />
              {flagging ? 'Submitting Discrepancy...' : 'Report This Difference'}
            </button>
          )}

          {currentPay.status === 'discrepancy_flagged' && !flagSuccessMessage && (
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 600 }}>
              <AlertTriangle size={16} />
              <span>Discrepancy already logged under investigation.</span>
            </div>
          )}
        </div>
      </div>

      {/* Itemized Calculation Breakdown Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--brand-950)' }}>
          Itemized Wage Computation
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Base Wage */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'var(--surface-muted)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>Base Wage</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {currentPay.regularUnits} {currentPay.wageType === 'daily' ? 'days' : 'units'} × ₹{currentPay.baseRate}/rate
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
              ₹{currentPay.basePay?.toLocaleString()}
            </div>
          </div>

          {/* Overtime Wage */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'var(--surface-muted)',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>Approved Overtime</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {currentPay.approvedOvertimeHours || 0} hours × ₹{currentPay.overtimeRate || 0}/hr
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--brand-700)' }}>
              +₹{currentPay.overtimePay?.toLocaleString()}
            </div>
          </div>

          {/* Additions */}
          {currentPay.additions > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>Approved Allowances & Stipends</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Travel, mess, or tool stipend</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--success)' }}>
                +₹{currentPay.additions?.toLocaleString()}
              </div>
            </div>
          )}

          {/* Deductions */}
          {currentPay.deductions > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: 'var(--surface-muted)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>Approved Deductions</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Provident fund / Advance adjustment
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--danger)' }}>
                -₹{currentPay.deductions?.toLocaleString()}
              </div>
            </div>
          )}

          {/* Net Total Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: 'var(--brand-100)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--brand-600)',
            marginTop: '8px'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--brand-950)', fontSize: '1.1rem' }}>
                Total Expected Net Pay
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-800)' }}>
                Base Pay + Overtime + Additions - Deductions
              </div>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--brand-950)' }}>
              ₹{currentPay.expectedNetPay?.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable "How was this calculated?" Section */}
      <div className="card" style={{ padding: '20px' }}>
        <button
          onClick={() => setExpandedExplanation(!expandedExplanation)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            fontWeight: 700,
            color: 'var(--brand-950)',
            fontSize: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} color="var(--brand-700)" />
            <span>{t.howCalculated}</span>
          </div>
          {expandedExplanation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedExplanation && (
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>1. Base Wage:</strong> Calculated by multiplying your total verified shifts (<code>{currentPay.regularUnits}</code> days) by your contracted rate of <code>₹{currentPay.baseRate}</code>.
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>2. Overtime:</strong> Any work beyond standard 8-hour shifts is recorded via biometric/QR supervisor logs. <code>{currentPay.approvedOvertimeHours || 0}</code> hours at the agreed overtime rate of <code>₹{currentPay.overtimeRate || 0}/hr</code> equals <code>₹{currentPay.overtimePay}</code>.
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>3. Deductions:</strong> Statutory contribution or advance deduction totals <code>₹{currentPay.deductions || 0}</code>.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
              <em>* Notice: This prototype demonstrates pure deterministic calculation from agreed organization rules. Real payroll depends on contracts and applicable statutory acts.</em>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
