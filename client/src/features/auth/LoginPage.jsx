import React, { useState } from 'react';
import { api } from '../../lib/api';
import { ShieldCheck, Mail, ArrowRight, AlertCircle, CheckCircle, Info, Lock } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (input) => {
    if (!input || !input.trim()) {
      return 'Please enter your Gmail address.';
    }
    const trimmed = input.trim();
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(trimmed)) {
      return 'Enter a valid Gmail address ending in @gmail.com.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await api.gmailLogin(email.trim());
      setSuccessMessage(res.message || 'Signed in successfully! Loading your workplace dashboard...');
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(res);
        }
      }, 300);
    } catch (err) {
      setError(err.message || "We couldn't verify your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--surface-muted)',
      padding: '24px 16px',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Top Banner Notice */}
      <div style={{
        maxWidth: '460px',
        width: '100%',
        marginBottom: '16px',
        backgroundColor: 'var(--brand-100)',
        border: '1px solid var(--brand-600)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        fontSize: '0.8rem',
        color: 'var(--brand-950)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Info size={16} color="var(--brand-700)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Authentication Mode:</strong> Any valid <code>@gmail.com</code> address can sign in. Real Google OAuth is supported when configured.
        </span>
      </div>

      {/* Main Login Card */}
      <div className="card" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px 32px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--brand-700)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            marginBottom: '16px',
            boxShadow: '0 4px 10px rgba(15, 118, 110, 0.3)'
          }}>
            <ShieldCheck size={32} />
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--brand-950)',
            marginBottom: '6px',
            fontFamily: "'Outfit', sans-serif"
          }}>
            Welcome to KaamSetu
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.4
          }}>
            Sign in to access your workplace dashboard.
          </p>
        </div>

        {/* Validation Error Alert */}
        {error && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #FCA5A5'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #86EFAC'
          }}>
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Gmail Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-secondary)" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="you@gmail.com"
                disabled={loading}
                autoComplete="email"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: error ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              Must end with <code>@gmail.com</code>. Any valid address is accepted.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              boxShadow: 'var(--shadow-md)',
              color: '#FFFFFF'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%' }} />
                Verifying Account...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Continue <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', textAlign: 'center', fontWeight: 600 }}>
            Quick Demo Shortcuts (or enter any custom Gmail):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('ramesh.kumar@gmail.com')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              ramesh.kumar@gmail.com <em>(Worker)</em>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('vikram.singh@gmail.com')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              vikram.singh@gmail.com <em>(Admin)</em>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('sandeep@gmail.com')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--surface-muted)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              sandeep@gmail.com <em>(New User)</em>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)'
      }}>
        KaamSetu — Fair Pay. Safe Work. Verified Skills. • UN SDG 8 Benchmark Prototype
      </div>
    </div>
  );
}
