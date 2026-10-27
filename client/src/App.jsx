import React, { useState, useEffect } from 'react';
import { api, getSession, clearSession } from './lib/api';
import AppShell from './components/AppShell';
import LoginPage from './features/auth/LoginPage';

// Worker Views
import WorkerHome from './features/worker/WorkerHome';
import WorkerPay from './features/worker/WorkerPay';
import WorkerAttendance from './features/worker/WorkerAttendance';
import WorkerSafeVoice from './features/worker/WorkerSafeVoice';
import WorkerReports from './features/worker/WorkerReports';
import WorkerSkills from './features/worker/WorkerSkills';

// Admin Views
import AdminOverview from './features/admin/AdminOverview';
import AdminWorkforce from './features/admin/AdminWorkforce';
import AdminGrievances from './features/admin/AdminGrievances';
import AdminSettings from './features/admin/AdminSettings';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [demoUsers, setDemoUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Worker Data
  const [payRecords, setPayRecords] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [workerGrievances, setWorkerGrievances] = useState([]);
  const [workerSkills, setWorkerSkills] = useState([]);

  // Admin Data
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [workersList, setWorkersList] = useState([]);
  const [adminGrievances, setAdminGrievances] = useState([]);

  // Handle successful login
  const handleLoginSuccess = (loginPayload) => {
    if (loginPayload && loginPayload.user) {
      setCurrentUser(loginPayload.user);
      if (loginPayload.organization) setCurrentOrg(loginPayload.organization);
      if (loginPayload.workerProfile) setWorkerProfile(loginPayload.workerProfile);
      if (loginPayload.user?.preferredLanguage) setLang(loginPayload.user.preferredLanguage);
    }
    loadSession(false);
  };

  // Load initial session and demo users
  const loadSession = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Check if there is an active session
      const savedSession = getSession();
      if (!savedSession || (!savedSession.userId && !savedSession.user)) {
        // User is not signed in yet; render LoginPage
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      // Restore user immediately from session cache if available
      if (savedSession.user) {
        setCurrentUser(savedSession.user);
        if (savedSession.organization) setCurrentOrg(savedSession.organization);
        if (savedSession.workerProfile) setWorkerProfile(savedSession.workerProfile);
        if (savedSession.user.preferredLanguage) setLang(savedSession.user.preferredLanguage);
      }

      // 1. Fetch available demo personas
      const usersRes = await api.getDemoUsers().catch(() => ({ users: [] }));
      if (usersRes?.users) setDemoUsers(usersRes.users);

      // 2. Fetch current user context
      const meRes = await api.getMe().catch(() => null);
      const activeUser = meRes?.user || savedSession.user;

      if (!activeUser) {
        clearSession();
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      setCurrentUser(activeUser);
      const activeOrg = meRes?.organization || savedSession.organization;
      if (activeOrg) setCurrentOrg(activeOrg);
      const activeProfile = meRes?.workerProfile || savedSession.workerProfile;
      if (activeProfile) setWorkerProfile(activeProfile);
      if (activeUser?.preferredLanguage) {
        setLang(activeUser.preferredLanguage);
      }

      // 3. Set default tab based on role
      if (activeUser?.role === 'worker') {
        setActiveTab('home');
        // Fetch worker specific data
        const [payRes, attRes, grvRes, sklRes] = await Promise.all([
          api.getMyPay().catch(() => ({ payRecords: [] })),
          api.getMyAttendance().catch(() => ({ attendance: [] })),
          api.getMyGrievances().catch(() => ({ grievances: [] })),
          api.getMySkills().catch(() => ({ skills: [] }))
        ]);
        setPayRecords(payRes?.payRecords || []);
        setAttendance(attRes?.attendance || []);
        setWorkerGrievances(grvRes?.grievances || []);
        setWorkerSkills(sklRes?.skills || []);
      } else {
        setActiveTab('overview');
        // Fetch admin specific data
        const [sumRes, wrkRes, grvRes] = await Promise.all([
          api.getDashboardSummary().catch(() => ({ summary: null })),
          api.getWorkersList().catch(() => ({ workers: [] })),
          api.getAllGrievances().catch(() => ({ grievances: [] }))
        ]);
        setDashboardSummary(sumRes?.summary || null);
        setWorkersList(wrkRes?.workers || []);
        setAdminGrievances(grvRes?.grievances || []);
      }
    } catch (err) {
      console.warn('Session load notice:', err);
      // Only clear session if we have NO saved session at all
      const savedSession = getSession();
      if (!savedSession || (!savedSession.userId && !savedSession.user)) {
        clearSession();
        setCurrentUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  // Switch demo user persona
  const handleSwitchUser = async (userId) => {
    try {
      const res = await api.demoLogin(userId);
      if (res && res.user) {
        handleLoginSuccess(res);
      } else {
        await loadSession(false);
      }
    } catch (err) {
      alert('Error switching user: ' + err.message);
    }
  };

  // Switch Industry (Construction <-> College)
  const handleSwitchIndustry = async () => {
    try {
      const isCurrentlyConstruction = currentOrg?.industry === 'construction';
      const targetIndustry = isCurrentlyConstruction ? 'college' : 'construction';

      // Find an appropriate default persona in that industry
      const targetUser = demoUsers.find(u => {
        const uOrg = demoUsers.find(du => du.id === u.id)?.organization;
        return uOrg?.industry === targetIndustry;
      });

      if (targetUser) {
        await handleSwitchUser(targetUser.id);
      }
    } catch (err) {
      alert('Error switching industry: ' + err.message);
    }
  };

  // Sign out handler
  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout notice:', err.message);
    } finally {
      clearSession();
      setCurrentUser(null);
      setCurrentOrg(null);
      setWorkerProfile(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        backgroundColor: 'var(--surface-muted)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--border)',
          borderTopColor: 'var(--brand-700)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{ color: 'var(--brand-950)', fontWeight: 600 }}>
          Loading KaamSetu Workspace...
        </div>
      </div>
    );
  }

  // If user is not authenticated, display the new Gmail LoginPage!
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'var(--surface-muted)'
      }}>
        <div className="card" style={{ maxWidth: '480px', textAlign: 'center', padding: '32px' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Connection Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
          <button className="btn btn-primary" onClick={loadSession}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const isWorker = currentUser?.role === 'worker';

  return (
    <AppShell
      currentUser={currentUser}
      currentOrg={currentOrg}
      demoUsers={demoUsers}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSwitchUser={handleSwitchUser}
      onSwitchIndustry={handleSwitchIndustry}
      lang={lang}
      onLanguageChange={setLang}
      onResetDemo={loadSession}
      onLogout={handleLogout}
    >
      {/* Worker Views */}
      {isWorker && activeTab === 'home' && (
        <WorkerHome
          user={currentUser}
          organization={currentOrg}
          workerProfile={workerProfile}
          payRecords={payRecords}
          attendance={attendance}
          grievances={workerGrievances}
          onNavigate={setActiveTab}
          lang={lang}
        />
      )}

      {isWorker && activeTab === 'pay' && (
        <WorkerPay
          payRecords={payRecords}
          onRefresh={loadSession}
          onNavigate={setActiveTab}
          lang={lang}
        />
      )}

      {isWorker && activeTab === 'attendance' && (
        <WorkerAttendance
          attendance={attendance}
          lang={lang}
        />
      )}

      {isWorker && activeTab === 'safevoice' && (
        <WorkerSafeVoice
          onGrievanceCreated={loadSession}
          onNavigate={setActiveTab}
          lang={lang}
        />
      )}

      {isWorker && activeTab === 'reports' && (
        <WorkerReports
          grievances={workerGrievances}
          lang={lang}
        />
      )}

      {isWorker && activeTab === 'skills' && (
        <WorkerSkills
          skills={workerSkills}
          onRefresh={loadSession}
          lang={lang}
        />
      )}

      {/* Admin / Reviewer Views */}
      {!isWorker && activeTab === 'overview' && (
        <AdminOverview
          summary={dashboardSummary}
          onRefresh={loadSession}
          onNavigate={setActiveTab}
          lang={lang}
        />
      )}

      {!isWorker && activeTab === 'workforce' && (
        <AdminWorkforce
          workers={workersList}
          organization={currentOrg}
        />
      )}

      {!isWorker && activeTab === 'grievances' && (
        <AdminGrievances
          grievances={adminGrievances}
          onRefresh={loadSession}
          lang={lang}
        />
      )}

      {!isWorker && activeTab === 'settings' && (
        <AdminSettings
          organization={currentOrg}
          onRefresh={loadSession}
        />
      )}
    </AppShell>
  );
}
