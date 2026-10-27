import React, { useState } from 'react';
import { translations } from '../lib/translations';
import DemoDataBanner from './DemoDataBanner';
import { 
  Building2, 
  GraduationCap, 
  User, 
  Languages, 
  Home, 
  Calendar, 
  IndianRupee, 
  Mic, 
  FileText, 
  Award, 
  Activity, 
  Users, 
  Sliders, 
  ShieldCheck,
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function AppShell({
  currentUser,
  currentOrg,
  demoUsers = [],
  activeTab,
  onTabChange,
  onSwitchUser,
  onSwitchIndustry,
  lang,
  onLanguageChange,
  onResetDemo,
  onLogout,
  children
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = translations[lang] || translations.en;
  const isWorker = currentUser?.role === 'worker';
  const isAdminOrReviewer = currentUser?.role === 'admin' || currentUser?.role === 'reviewer';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface-muted)' }}>
      {/* Demo Prototype Disclaimer Banner */}
      <DemoDataBanner onReset={onResetDemo} />

      {/* Main Top Header */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Brand Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-950)', letterSpacing: '-0.02em' }}>
                  {t.brandName}
                </span>
                <span className={`badge ${currentOrg?.industry === 'construction' ? 'badge-brand' : 'badge-info'}`}>
                  {currentOrg?.industry?.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {t.brandTagline}
              </div>
            </div>
          </div>

          {/* Controls: Persona Switcher, Industry Switcher & Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Industry Switcher Quick Action */}
            <button
              onClick={onSwitchIndustry}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '6px 12px',
                borderColor: 'var(--brand-600)',
                color: 'var(--brand-800)'
              }}
              title="Switch demo between Construction and College"
            >
              {currentOrg?.industry === 'construction' ? (
                <>
                  <GraduationCap size={15} color="var(--brand-700)" />
                  <span>Switch to College</span>
                </>
              ) : (
                <>
                  <Building2 size={15} color="var(--brand-700)" />
                  <span>Switch to Construction</span>
                </>
              )}
            </button>

            {/* Persona Switcher Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={currentUser?.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--brand-950)',
                  cursor: 'pointer'
                }}
              >
                <optgroup label="Construction Personas">
                  {demoUsers
                    .filter(u => u.organizationId === 'org-construction')
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.displayName} ({u.role?.toUpperCase()})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="College Personas">
                  {demoUsers
                    .filter(u => u.organizationId === 'org-college')
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.displayName} ({u.role?.toUpperCase()})
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Languages size={16} color="var(--text-secondary)" />
              <select
                value={lang}
                onChange={(e) => onLanguageChange(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="mr">मराठी (MR)</option>
              </select>
            </div>

            {/* Current Logged-in User Account - Top Right Corner */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 4px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  backgroundColor: userMenuOpen ? 'var(--brand-100)' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Account menu"
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-700)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {(currentUser?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--brand-950)',
                    maxWidth: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {currentUser?.email || (currentUser?.displayName ? `${currentUser.displayName.toLowerCase().replace(/\s+/g, '.')}@gmail.com` : 'user@gmail.com')}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 600, lineHeight: 1 }}>
                    ● Signed in
                  </span>
                </div>
                <ChevronDown size={14} color="var(--text-secondary)" />
              </button>

              {/* Account Dropdown Popover */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '260px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '16px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--brand-950)', fontSize: '0.95rem' }}>
                      {currentUser?.displayName || 'User'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', wordBreak: 'break-all', marginTop: '2px' }}>
                      {currentUser?.email || (currentUser?.displayName ? `${currentUser.displayName.toLowerCase().replace(/\s+/g, '.')}@gmail.com` : 'user@gmail.com')}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <span className="badge badge-brand" style={{ fontSize: '0.65rem' }}>
                        {currentUser?.role?.toUpperCase()}
                      </span>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                        {currentOrg?.industry?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Session Mode: <strong>Prototype Verified</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="btn btn-secondary"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: 'var(--danger)',
                      borderColor: '#FCA5A5'
                    }}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation Tabs */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderTop: '1px solid var(--border)'
        }}>
          {isWorker ? (
            <>
              <button
                onClick={() => onTabChange('home')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'home' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'home' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Home size={16} /> Home
              </button>
              <button
                onClick={() => onTabChange('pay')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'pay' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'pay' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <IndianRupee size={16} /> My Pay (FairPay)
              </button>
              <button
                onClick={() => onTabChange('attendance')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'attendance' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'attendance' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Calendar size={16} /> Attendance
              </button>
              <button
                onClick={() => onTabChange('safevoice')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'safevoice' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'safevoice' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Mic size={16} /> Report Concern (SafeVoice)
              </button>
              <button
                onClick={() => onTabChange('reports')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'reports' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'reports' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <FileText size={16} /> My Reports
              </button>
              <button
                onClick={() => onTabChange('skills')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'skills' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'skills' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Award size={16} /> SkillPassport
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onTabChange('overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'overview' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'overview' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Activity size={16} /> Risk Radar Overview
              </button>
              <button
                onClick={() => onTabChange('workforce')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'workforce' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'workforce' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Users size={16} /> Workforce Directory
              </button>
              <button
                onClick={() => onTabChange('grievances')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'grievances' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'grievances' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <FileText size={16} /> Grievance Resolution
              </button>
              <button
                onClick={() => onTabChange('settings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: activeTab === 'settings' ? 'var(--brand-700)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'settings' ? '3px solid var(--brand-700)' : '3px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <Sliders size={16} /> Industry Settings
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '24px 16px', flex: 1 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border)',
        padding: '20px 16px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <strong>KaamSetu</strong> — Fair Pay. Safe Work. Verified Skills.
          </div>
          <div>
            United Nations SDG 8 Benchmark Prototype
          </div>
        </div>
      </footer>
    </div>
  );
}
