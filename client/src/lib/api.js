/**
 * API client wrapper for KaamSetu
 * Includes seamless client-side resilient fallback for static deployments (Vercel, Netlify, GitHub Pages)
 */

import { clientFallbackStore } from './clientFallbackStore';

const SESSION_KEY = 'kaamsetu_session';
const DEMO_USER_KEY = 'kaamsetu_demo_user_id';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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

  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // If endpoint exists and responded normally
    if (response.ok) {
      return await response.json().catch(() => ({}));
    }

    // If server returned 404 (common on static deployments where backend isn't mapped),
    // trigger graceful fallback rather than breaking the application
    if (response.status === 404) {
      const fallbackResult = handleStaticFallback(path, options);
      if (fallbackResult !== null) {
        return fallbackResult;
      }
    }

    const data = await response.json().catch(() => ({}));
    const errorMsg = data.error || `HTTP error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  } catch (err) {
    // If network error (e.g. backend server completely offline in static host deployment)
    const fallbackResult = handleStaticFallback(path, options);
    if (fallbackResult !== null) {
      return fallbackResult;
    }
    throw err;
  }
}

/**
 * Executes operations on client-side store if backend is not deployed
 */
function handleStaticFallback(path, options = {}) {
  const userId = getApiDemoUser() || 'usr-worker-1';
  const method = (options.method || 'GET').toUpperCase();
  let body = {};
  try {
    if (options.body) body = JSON.parse(options.body);
  } catch {}

  console.warn(`[KaamSetu] Backend endpoint '${path}' returned 404/unreachable. Activating resilient client-side deployment store.`);

  if (path === '/api/auth/me') {
    return clientFallbackStore.getMe(userId);
  }
  if (path === '/api/auth/demo-users') {
    return clientFallbackStore.getDemoUsers();
  }
  if (path === '/api/auth/gmail-login' && method === 'POST') {
    return clientFallbackStore.gmailLogin(body.email || '');
  }
  if (path === '/api/auth/demo-login' && method === 'POST') {
    return clientFallbackStore.demoLogin(body.userId || '');
  }
  if (path === '/api/auth/logout') {
    return { message: 'Logged out successfully.' };
  }
  if (path === '/api/organizations/current' || path === '/api/organizations') {
    const me = clientFallbackStore.getMe(userId);
    return { organization: me.organization, organizations: [me.organization] };
  }
  if (path === '/api/workers/me/pay') {
    const me = clientFallbackStore.getMe(userId);
    return clientFallbackStore.getMyPay(me.user?.workerId, me.user?.organizationId);
  }
  if (path === '/api/workers/me/attendance') {
    const me = clientFallbackStore.getMe(userId);
    return clientFallbackStore.getMyAttendance(me.user?.workerId, me.user?.organizationId);
  }
  if (path === '/api/workers/me/skills') {
    const me = clientFallbackStore.getMe(userId);
    return clientFallbackStore.getMySkills(me.user?.workerId, me.user?.organizationId);
  }
  if (path === '/api/grievances/mine') {
    const me = clientFallbackStore.getMe(userId);
    return clientFallbackStore.getMyGrievances(me.user?.workerId, me.user?.organizationId);
  }
  if (path.startsWith('/api/grievances') && method === 'GET') {
    const me = clientFallbackStore.getMe(userId);
    return clientFallbackStore.getAllGrievances(me.user?.organizationId);
  }
  if (path === '/api/grievances' && method === 'POST') {
    const me = clientFallbackStore.getMe(userId);
    return clientFallbackStore.submitGrievance(body, me.user, me.organization);
  }
  if (path.includes('/status') && method === 'PATCH') {
    const match = path.match(/\/api\/grievances\/([^/]+)\/status/);
    const me = clientFallbackStore.getMe(userId);
    if (match) {
      return clientFallbackStore.updateGrievanceStatus(match[1], body, me.user);
    }
  }
  if (path === '/api/dashboard/summary') {
    const me = clientFallbackStore.getMe(userId);
    return clientFallbackStore.getDashboardSummary(me.user?.organizationId);
  }
  if (path === '/api/workers') {
    const me = clientFallbackStore.getMe(userId);
    return clientFallbackStore.getWorkersList(me.user?.organizationId);
  }
  if (path.includes('/alerts/') && path.endsWith('/review')) {
    const match = path.match(/\/alerts\/([^/]+)\/review/);
    const me = clientFallbackStore.getMe(userId);
    if (match) return clientFallbackStore.markAlertReviewed(match[1], me.user);
  }
  if (path === '/api/dashboard/demo-reset') {
    return clientFallbackStore.resetDemoData();
  }
  if (path === '/api/grievances/ai-classify') {
    return {
      suggestion: {
        suggestedCategory: body.text?.toLowerCase().includes('scaffold') || body.text?.toLowerCase().includes('fall') ? 'safety' : 'pay',
        suggestedPriority: 'high',
        summary: 'AI Analysis: Workplace condition concern identified.',
        isAiGenerated: true,
        confidence: 0.88
      }
    };
  }

  return null;
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
