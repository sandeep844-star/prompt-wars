/**
 * Client-Side Resilient Fallback Store
 * Ensures the application functions seamlessly even when deployed to static hosts
 * (Vercel, Netlify, GitHub Pages) where a separate backend server is not running.
 */

const LOCAL_DB_KEY = 'kaamsetu_client_db';

const defaultSeedData = {
  organizations: [
    {
      id: 'org-construction',
      name: 'Apex Infrastructure & Metro Works',
      industry: 'construction',
      tagline: 'Metro Line 4 - Urban Transit Project',
      settings: {
        primaryWageType: 'daily',
        standardShiftHours: 8,
        defaultDailyRate: 600,
        defaultOvertimeRate: 120,
        overtimeAlertThresholdHours: 10,
        departmentsOrSites: ['Sector 7 Viaduct', 'Block C Residential', 'Foundations & Piling', 'Steel Fabrication Yard'],
        grievanceCategories: ['safety', 'pay', 'hours', 'harassment', 'other']
      }
    },
    {
      id: 'org-college',
      name: 'Navodaya Institute of Engineering & Technology',
      industry: 'college',
      tagline: 'Campus Facilities & Operations',
      settings: {
        primaryWageType: 'monthly',
        standardShiftHours: 8,
        defaultMonthlyRate: 20000,
        defaultDailyRate: 700,
        defaultOvertimeRate: 130,
        overtimeAlertThresholdHours: 12,
        departmentsOrSites: ['Campus Facilities & Maintenance', 'Hostels & Mess Operations', 'Electrical & HVAC', 'Campus Grounds & Security'],
        grievanceCategories: ['safety', 'pay', 'hours', 'harassment', 'other']
      }
    }
  ],
  users: [
    {
      id: 'usr-worker-1',
      email: 'ramesh.kumar@gmail.com',
      displayName: 'Ramesh Kumar',
      role: 'worker',
      title: 'Senior Mason & Shuttering Craftsman',
      organizationId: 'org-construction',
      workerId: 'w-101',
      preferredLanguage: 'hi',
      phone: '+91 98765 43210',
      active: true
    },
    {
      id: 'usr-worker-2',
      email: 'sunita.devi@gmail.com',
      displayName: 'Sunita Devi',
      role: 'worker',
      title: 'Structural Painter & Finisher',
      organizationId: 'org-construction',
      workerId: 'w-102',
      preferredLanguage: 'en',
      phone: '+91 98765 43211',
      active: true
    },
    {
      id: 'usr-worker-3',
      email: 'rajesh.sharma@gmail.com',
      displayName: 'Rajesh Sharma',
      role: 'worker',
      title: 'HVAC & Plumbing Technician',
      organizationId: 'org-college',
      workerId: 'w-201',
      preferredLanguage: 'hi',
      phone: '+91 98765 43212',
      active: true
    },
    {
      id: 'usr-worker-4',
      email: 'priya.nair@gmail.com',
      displayName: 'Priya Nair',
      role: 'worker',
      title: 'Mess & Sanitation Lead',
      organizationId: 'org-college',
      workerId: 'w-202',
      preferredLanguage: 'en',
      phone: '+91 98765 43213',
      active: true
    },
    {
      id: 'usr-admin-con',
      email: 'vikram.singh@gmail.com',
      displayName: 'Vikram Singh',
      role: 'admin',
      title: 'Site Operations Director',
      organizationId: 'org-construction',
      preferredLanguage: 'en',
      phone: '+91 98765 43200',
      active: true
    },
    {
      id: 'usr-admin-col',
      email: 'aruna.rao@gmail.com',
      displayName: 'Dr. Aruna Rao',
      role: 'admin',
      title: 'Registrar & Campus Operations Head',
      organizationId: 'org-college',
      preferredLanguage: 'en',
      phone: '+91 98765 43201',
      active: true
    },
    {
      id: 'usr-reviewer-safety',
      email: 'kavita.patel@gmail.com',
      displayName: 'Kavita Patel',
      role: 'reviewer',
      title: 'Occupational Safety & Grievance Officer',
      organizationId: 'org-construction',
      preferredLanguage: 'en',
      phone: '+91 98765 43202',
      active: true
    }
  ],
  workers: [
    {
      id: 'w-101',
      organizationId: 'org-construction',
      displayName: 'Ramesh Kumar',
      departmentOrSite: 'Sector 7 Viaduct',
      jobRole: 'Mason & Shuttering Craftsman',
      wageType: 'daily',
      baseRate: 600,
      overtimeRate: 120,
      active: true,
      joinedDate: '2025-03-15'
    },
    {
      id: 'w-102',
      organizationId: 'org-construction',
      displayName: 'Sunita Devi',
      departmentOrSite: 'Block C Residential',
      jobRole: 'Structural Painter & Finisher',
      wageType: 'daily',
      baseRate: 650,
      overtimeRate: 125,
      active: true,
      joinedDate: '2025-06-01'
    },
    {
      id: 'w-201',
      organizationId: 'org-college',
      displayName: 'Rajesh Sharma',
      departmentOrSite: 'Campus Facilities & Maintenance',
      jobRole: 'HVAC & Plumbing Technician',
      wageType: 'daily',
      baseRate: 700,
      overtimeRate: 130,
      active: true,
      joinedDate: '2024-08-20'
    },
    {
      id: 'w-202',
      organizationId: 'org-college',
      displayName: 'Priya Nair',
      departmentOrSite: 'Hostels & Mess Operations',
      jobRole: 'Mess & Sanitation Lead',
      wageType: 'monthly',
      baseRate: 21000,
      overtimeRate: 140,
      active: true,
      joinedDate: '2024-01-10'
    }
  ],
  attendanceRecords: [
    {
      id: 'att-101-1',
      organizationId: 'org-construction',
      workerId: 'w-101',
      period: '2026-10',
      regularDays: 22,
      regularHours: 176,
      approvedOvertimeHours: 5,
      leaveDays: 2,
      status: 'approved',
      source: 'qr_kiosk',
      shiftDetails: [
        { date: '2026-10-01', regularHours: 8, overtimeHours: 0, status: 'approved' },
        { date: '2026-10-02', regularHours: 8, overtimeHours: 2, status: 'approved', note: 'Concrete pour overtime' },
        { date: '2026-10-03', regularHours: 8, overtimeHours: 0, status: 'approved' },
        { date: '2026-10-05', regularHours: 8, overtimeHours: 1, status: 'approved', note: 'Reinforcement alignment' },
        { date: '2026-10-06', regularHours: 8, overtimeHours: 0, status: 'approved' },
        { date: '2026-10-07', regularHours: 8, overtimeHours: 2, status: 'approved', note: 'Pier cap shuttering' }
      ]
    },
    {
      id: 'att-201-1',
      organizationId: 'org-college',
      workerId: 'w-201',
      period: '2026-10',
      regularDays: 20,
      regularHours: 160,
      approvedOvertimeHours: 14,
      leaveDays: 4,
      status: 'approved',
      source: 'biometric_kiosk'
    }
  ],
  payRecords: [
    {
      id: 'pay-101-1',
      organizationId: 'org-construction',
      workerId: 'w-101',
      workerName: 'Ramesh Kumar',
      periodStart: '2026-10-01',
      periodEnd: '2026-10-15',
      periodLabel: '01 Oct 2026 - 15 Oct 2026 (Fortnight 1)',
      wageType: 'daily',
      baseRate: 600,
      regularUnits: 22,
      approvedOvertimeHours: 5,
      overtimeRate: 120,
      basePay: 13200,
      overtimePay: 600,
      additions: 0,
      deductions: 300,
      expectedNetPay: 13500,
      recordedPayment: 12000,
      currency: 'INR',
      status: 'discrepancy_flagged',
      flaggedGrievanceId: 'grv-002',
      calculationVersion: '1.0.0-deterministic',
      formulaBreakdown: {
        baseFormula: '22 days worked × ₹600/day = ₹13,200',
        overtimeFormula: '5 approved OT hours × ₹120/hr = ₹600',
        deductionsFormula: 'Standard safety gear / PF contribution = -₹300'
      }
    }
  ],
  grievances: [
    {
      id: 'grv-001',
      caseNumber: 'KS-CON-2026-001',
      organizationId: 'org-construction',
      workerId: 'w-101',
      workerName: 'Ramesh Kumar',
      category: 'safety',
      priority: 'high',
      status: 'investigating',
      visibility: 'identified',
      description: 'Unsafe scaffolding at Block C, 3rd floor. Planks are shifting, missing toe-boards, and there are no safety catch nets below.',
      aiSummary: 'AI Analysis: High-risk structural fall hazard detected in working at heights.',
      assignedReviewerId: 'usr-reviewer-safety',
      assignedReviewerName: 'Kavita Patel',
      resolutionNote: null,
      createdAt: '2026-10-25T08:30:00.000Z',
      timeline: [
        {
          id: 'evt-001-1',
          eventType: 'created',
          toStatus: 'submitted',
          note: 'Concern submitted via SafeVoice.',
          actorName: 'Ramesh Kumar',
          actorRole: 'worker',
          timestamp: '2026-10-25T08:30:00.000Z'
        },
        {
          id: 'evt-001-2',
          eventType: 'status_change',
          toStatus: 'investigating',
          note: 'Assigned site safety supervisor for physical inspection.',
          actorName: 'Kavita Patel',
          actorRole: 'reviewer',
          timestamp: '2026-10-26T14:15:00.000Z'
        }
      ]
    },
    {
      id: 'grv-002',
      caseNumber: 'KS-CON-2026-002',
      organizationId: 'org-construction',
      workerId: 'w-101',
      workerName: 'Ramesh Kumar',
      category: 'pay',
      priority: 'normal',
      status: 'submitted',
      visibility: 'identified',
      description: 'Wage Discrepancy for Pay Period 1-15 Oct. Expected ₹13,500 based on 22 days @ ₹600 plus 5 OT hours, but recorded payment shows ₹12,000 (shortfall of ₹1,500).',
      aiSummary: 'AI Analysis: Wage discrepancy report. Claims ₹1,500 shortfall.',
      createdAt: '2026-10-26T09:00:00.000Z',
      timeline: [
        {
          id: 'evt-002-1',
          eventType: 'created',
          toStatus: 'submitted',
          note: 'Wage discrepancy automatically pre-filled from FairPay.',
          actorName: 'Ramesh Kumar',
          actorRole: 'worker',
          timestamp: '2026-10-26T09:00:00.000Z'
        }
      ]
    }
  ],
  riskAlerts: [
    {
      id: 'alert-001',
      organizationId: 'org-construction',
      type: 'safety_hazard',
      severity: 'high',
      title: 'High-Priority Fall Hazard Active',
      description: 'Scaffolding safety concern (KS-CON-2026-001) in Sector 7 / Block C is currently under active investigation.',
      ruleExplanation: 'Triggered because an unresolved High-Severity Safety Grievance is pending corrective action.',
      relatedRecordId: 'grv-001',
      reviewed: false,
      suggestedAction: 'Verify site supervisor scaffold safety checklist.',
      createdAt: '2026-10-25T08:35:00.000Z'
    },
    {
      id: 'alert-002',
      organizationId: 'org-construction',
      type: 'wage_discrepancy',
      severity: 'medium',
      title: 'Discrepancy Reported on Payment Disbursement',
      description: 'Worker Ramesh Kumar reported a ₹1,500 gap between expected net wage (₹13,500) and recorded payment (₹12,000).',
      ruleExplanation: 'Triggered when recorded payment is more than 5% below calculated deterministic entitlement.',
      relatedRecordId: 'grv-002',
      reviewed: false,
      suggestedAction: 'Audit payroll register against approved overtime records in Sector 7.',
      createdAt: '2026-10-26T09:05:00.000Z'
    }
  ],
  skills: [
    {
      id: 'sk-101-1',
      workerId: 'w-101',
      organizationId: 'org-construction',
      skillName: 'Level 2 Shuttering & Scaffolding',
      category: 'Civil Construction',
      issuer: 'National Skill Development Corporation (NSDC)',
      issueDate: '2024-05-10',
      expiryDate: '2027-05-10',
      verificationStatus: 'verified',
      verifierNote: 'Official NSDC QR badge verified by Site Engineer',
      isPublicConsentGiven: true
    }
  ]
};

function getLocalData() {
  try {
    const raw = localStorage.getItem(LOCAL_DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Fallback store parse error:', e);
  }
  const fresh = JSON.parse(JSON.stringify(defaultSeedData));
  saveLocalData(fresh);
  return fresh;
}

function saveLocalData(data) {
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Fallback store save error:', e);
  }
}

export const clientFallbackStore = {
  getMe: (userId) => {
    const data = getLocalData();
    const user = data.users.find(u => u.id === userId) || data.users[0];
    const organization = data.organizations.find(o => o.id === user.organizationId);
    const workerProfile = user.workerId ? data.workers.find(w => w.id === user.workerId) : null;
    return { user, organization, workerProfile };
  },

  getDemoUsers: () => {
    const data = getLocalData();
    const users = data.users.map(u => ({
      ...u,
      organization: data.organizations.find(o => o.id === u.organizationId)
    }));
    return { users };
  },

  gmailLogin: (email) => {
    const data = getLocalData();
    const normalized = email.trim().toLowerCase();
    let user = data.users.find(u => u.email && u.email.toLowerCase() === normalized);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const namePart = normalized.split('@')[0].replace(/[._+-]+/g, ' ');
      const displayName = namePart
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Google User';

      const workerId = `w-gm-${Date.now().toString().slice(-4)}`;
      const worker = {
        id: workerId,
        organizationId: 'org-construction',
        displayName,
        departmentOrSite: 'Sector 7 Viaduct',
        jobRole: 'Field Craftsman',
        wageType: 'daily',
        baseRate: 600,
        overtimeRate: 120,
        active: true,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      data.workers.push(worker);

      user = {
        id: `usr-gm-${Date.now()}`,
        email: normalized,
        displayName,
        role: 'worker',
        title: 'Field Craftsman',
        organizationId: 'org-construction',
        workerId: worker.id,
        preferredLanguage: 'en',
        active: true,
        isPrototypeGmail: true,
        authProvider: 'gmail_prototype'
      };
      data.users.push(user);

      // Add starter attendance & pay records
      data.attendanceRecords.push({
        id: `att-${worker.id}-1`,
        organizationId: 'org-construction',
        workerId: worker.id,
        period: '2026-10',
        regularDays: 20,
        regularHours: 160,
        approvedOvertimeHours: 4,
        leaveDays: 2,
        status: 'approved',
        source: 'biometric_kiosk'
      });

      data.payRecords.push({
        id: `pay-${worker.id}-1`,
        organizationId: 'org-construction',
        workerId: worker.id,
        workerName: displayName,
        periodStart: '2026-10-01',
        periodEnd: '2026-10-15',
        periodLabel: '01 Oct 2026 - 15 Oct 2026 (Fortnight 1)',
        wageType: 'daily',
        baseRate: 600,
        regularUnits: 20,
        approvedOvertimeHours: 4,
        overtimeRate: 120,
        basePay: 12000,
        overtimePay: 480,
        additions: 0,
        deductions: 200,
        expectedNetPay: 12280,
        recordedPayment: 11000,
        currency: 'INR',
        status: 'discrepancy_flagged',
        calculationVersion: '1.0.0-deterministic',
        formulaBreakdown: {
          baseFormula: '20 days worked × ₹600/day = ₹12,000',
          overtimeFormula: '4 approved OT hours × ₹120/hr = ₹480',
          deductionsFormula: 'PF deduction = -₹200'
        }
      });

      saveLocalData(data);
    }

    const organization = data.organizations.find(o => o.id === user.organizationId);
    const workerProfile = user.workerId ? data.workers.find(w => w.id === user.workerId) : null;

    return {
      message: isNewUser ? 'Account created and signed in successfully.' : 'Welcome back! Signed in successfully.',
      user,
      organization,
      workerProfile,
      isPrototype: true,
      isNewUser
    };
  },

  demoLogin: (userId) => {
    const data = getLocalData();
    const user = data.users.find(u => u.id === userId) || data.users[0];
    const organization = data.organizations.find(o => o.id === user.organizationId);
    const workerProfile = user.workerId ? data.workers.find(w => w.id === user.workerId) : null;
    return {
      message: 'Demo login successful.',
      user,
      organization,
      workerProfile
    };
  },

  getMyPay: (workerId, orgId) => {
    const data = getLocalData();
    const records = data.payRecords.filter(p => p.workerId === workerId || p.organizationId === orgId);
    return { payRecords: records.length > 0 ? records : data.payRecords };
  },

  getMyAttendance: (workerId, orgId) => {
    const data = getLocalData();
    const records = data.attendanceRecords.filter(a => a.workerId === workerId || a.organizationId === orgId);
    return { attendance: records.length > 0 ? records : data.attendanceRecords };
  },

  getMySkills: (workerId, orgId) => {
    const data = getLocalData();
    const skills = data.skills.filter(s => s.workerId === workerId || s.organizationId === orgId);
    return { skills: skills.length > 0 ? skills : data.skills };
  },

  getMyGrievances: (workerId, orgId) => {
    const data = getLocalData();
    const list = data.grievances.filter(g => g.workerId === workerId || g.organizationId === orgId);
    return { grievances: list };
  },

  getAllGrievances: (orgId) => {
    const data = getLocalData();
    const list = data.grievances.filter(g => g.organizationId === orgId);
    return { grievances: list.length > 0 ? list : data.grievances };
  },

  submitGrievance: (payload, user, org) => {
    const data = getLocalData();
    const count = data.grievances.length + 1;
    const prefix = org?.industry === 'college' ? 'KS-COL' : 'KS-CON';
    const caseNumber = `${prefix}-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;
    const newGrievance = {
      id: `grv-${Date.now()}`,
      caseNumber,
      organizationId: org?.id || 'org-construction',
      workerId: payload.visibility === 'anonymous' ? null : (user?.workerId || user?.id),
      workerName: payload.visibility === 'anonymous' ? 'Anonymous Worker' : user?.displayName,
      category: payload.category || 'safety',
      priority: payload.priority || 'normal',
      status: 'submitted',
      visibility: payload.visibility || 'identified',
      description: payload.description,
      aiSummary: payload.aiSummary || null,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: `evt-${Date.now()}`,
          eventType: 'created',
          toStatus: 'submitted',
          note: 'Concern submitted.',
          actorName: user?.displayName || 'Worker',
          actorRole: user?.role || 'worker',
          timestamp: new Date().toISOString()
        }
      ]
    };
    data.grievances.unshift(newGrievance);
    saveLocalData(data);
    return { message: 'Grievance submitted successfully.', grievance: newGrievance };
  },

  updateGrievanceStatus: (id, payload, user) => {
    const data = getLocalData();
    const g = data.grievances.find(item => item.id === id);
    if (g) {
      g.status = payload.toStatus;
      if (payload.toStatus === 'resolved') {
        g.resolutionNote = payload.note;
      }
      if (!g.timeline) g.timeline = [];
      g.timeline.push({
        id: `evt-${Date.now()}`,
        eventType: 'status_change',
        toStatus: payload.toStatus,
        note: payload.note,
        actorName: user?.displayName || 'Admin',
        actorRole: user?.role || 'admin',
        timestamp: new Date().toISOString()
      });
      saveLocalData(data);
      return { message: 'Status updated.', grievance: g };
    }
    throw new Error('Grievance not found');
  },

  getDashboardSummary: (orgId) => {
    const data = getLocalData();
    const org = data.organizations.find(o => o.id === orgId) || data.organizations[0];
    const orgWorkers = data.workers.filter(w => w.organizationId === org.id);
    const orgGrievances = data.grievances.filter(g => g.organizationId === org.id);
    const orgPayRecords = data.payRecords.filter(p => p.organizationId === org.id);
    const orgAlerts = data.riskAlerts.filter(a => a.organizationId === org.id);

    return {
      summary: {
        organization: org,
        metrics: {
          activeWorkers: orgWorkers.length,
          openGrievancesCount: orgGrievances.filter(g => g.status !== 'resolved').length,
          discrepanciesCount: orgPayRecords.filter(p => p.status === 'discrepancy_flagged').length,
          pendingAlertsCount: orgAlerts.filter(a => !a.reviewed).length,
          totalAlertsCount: orgAlerts.length
        },
        alerts: orgAlerts,
        openGrievancesQueue: orgGrievances.filter(g => g.status !== 'resolved'),
        discrepancyQueue: orgPayRecords.filter(p => p.status === 'discrepancy_flagged').map(p => ({
          id: p.id,
          workerName: p.workerName,
          periodLabel: p.periodLabel,
          expectedNetPay: p.expectedNetPay,
          recordedPayment: p.recordedPayment,
          difference: p.recordedPayment - p.expectedNetPay,
          status: p.status
        }))
      }
    };
  },

  getWorkersList: (orgId) => {
    const data = getLocalData();
    const workers = data.workers.filter(w => w.organizationId === orgId);
    return { workers: workers.length > 0 ? workers : data.workers };
  },

  markAlertReviewed: (alertId, user) => {
    const data = getLocalData();
    const alert = data.riskAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.reviewed = true;
      alert.reviewedBy = user?.displayName || 'Admin';
      alert.reviewedAt = new Date().toISOString();
      saveLocalData(data);
      return { message: 'Alert marked reviewed', alert };
    }
    return { message: 'Alert updated' };
  },

  resetDemoData: () => {
    localStorage.removeItem(LOCAL_DB_KEY);
    return { message: 'Reset successful' };
  }
};
