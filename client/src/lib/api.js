/**
 * API client wrapper for KaamSetu
 */

const SESSION_KEY = 'kaamsetu_session';
const DEMO_USER_KEY = 'kaamsetu_demo_user_id';

let activeDemoUserId = null;

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  if (session && session.user) {
    activeDemoUserId = session.user.id;
    localStorage.setItem(DEMO_USER_KEY, session.user.id);
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      userId: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
      role: session.user.role,
      isPrototype: session.isPrototype ?? true
    }));
  }
}

export function clearSession() {
  activeDemoUserId = null;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(DEMO_USER_KEY);
}

export function setApiDemoUser(userId) {
  activeDemoUserId = userId;
  localStorage.setItem(DEMO_USER_KEY, userId);
}

export function getApiDemoUser() {
  if (activeDemoUserId) return activeDemoUserId;
  const session = getSession();
  if (session?.userId) {
    activeDemoUserId = session.userId;
    return activeDemoUserId;
  }
  const saved = localStorage.getItem(DEMO_USER_KEY);
  if (saved) activeDemoUserId = saved;
  return activeDemoUserId || '';
}

async function request(path, options = {}) {
  const userId = getApiDemoUser();
  const headers = {
    'Content-Type': 'application/json',
    ...(userId ? { 'x-demo-user-id': userId } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(path, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `HTTP error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  getMe: () => request('/api/auth/me'),
  getDemoUsers: () => request('/api/auth/demo-users'),
  gmailLogin: async (email) => {
    const res = await request('/api/auth/gmail-login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    if (res && res.user) {
      setSession(res);
    }
    return res;
  },
  demoLogin: async (userId) => {
    setApiDemoUser(userId);
    const res = await request('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    if (res && res.user) {
      setSession(res);
    }
    return res;
  },
  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      clearSession();
    }
  },

  // Organizations
  getOrganizations: () => request('/api/organizations'),
  getCurrentOrg: () => request('/api/organizations/current'),
  updateOrgSettings: (orgId, settings) =>
    request(`/api/organizations/${orgId}/settings`, {
      method: 'PATCH',
      body: JSON.stringify({ settings })
    }),

  // Worker Endpoints
  getWorkerMe: () => request('/api/workers/me'),
  getMyAttendance: () => request('/api/workers/me/attendance'),
  getMyPay: () => request('/api/workers/me/pay'),
  getMySkills: () => request('/api/workers/me/skills'),
  toggleSkillConsent: (skillId, isPublicConsentGiven) =>
    request(`/api/workers/me/skills/${skillId}/consent`, {
      method: 'PATCH',
      body: JSON.stringify({ isPublicConsentGiven })
    }),

  // Pay
  previewPay: (calcInput) =>
    request('/api/pay/preview', {
      method: 'POST',
      body: JSON.stringify(calcInput)
    }),
  flagPayDiscrepancy: (payRecordId, workerStatement) =>
    request(`/api/pay/${payRecordId}/flag-discrepancy`, {
      method: 'POST',
      body: JSON.stringify({ workerStatement })
    }),

  // Grievances
  submitGrievance: (grievanceData) =>
    request('/api/grievances', {
      method: 'POST',
      body: JSON.stringify(grievanceData)
    }),
  getMyGrievances: () => request('/api/grievances/mine'),
  getAllGrievances: (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/api/grievances${query ? `?${query}` : ''}`);
  },
  getGrievanceById: (id) => request(`/api/grievances/${id}`),
  updateGrievanceStatus: (id, payload) =>
    request(`/api/grievances/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  addGrievanceNote: (id, note) =>
    request(`/api/grievances/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note })
    }),
  classifyAiGrievance: (text) =>
    request('/api/grievances/ai-classify', {
      method: 'POST',
      body: JSON.stringify({ text })
    }),

  // Admin / Dashboard
  getDashboardSummary: () => request('/api/dashboard/summary'),
  getWorkersList: () => request('/api/workers'),
  markAlertReviewed: (alertId) =>
    request(`/api/dashboard/alerts/${alertId}/review`, {
      method: 'PATCH'
    }),
  resetDemoData: () =>
    request('/api/dashboard/demo-reset', {
      method: 'POST'
    })
};
