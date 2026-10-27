/**
 * KaamSetu Demo Seed Data
 * Comprehensive synthetic records matching Prd.md, Implementation.md, and Architecture.md.
 */

export const initialSeedData = {
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
        departmentsOrSites: [
          'Sector 7 Viaduct',
          'Block C Residential',
          'Foundations & Piling',
          'Steel Fabrication Yard'
        ],
        grievanceCategories: ['safety', 'pay', 'hours', 'harassment', 'other']
      },
      createdAt: '2026-01-01T00:00:00.000Z'
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
        departmentsOrSites: [
          'Campus Facilities & Maintenance',
          'Hostels & Mess Operations',
          'Electrical & HVAC',
          'Campus Grounds & Security'
        ],
        grievanceCategories: ['safety', 'pay', 'hours', 'harassment', 'other']
      },
      createdAt: '2026-01-01T00:00:00.000Z'
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
    // Ramesh Kumar (w-101) - 22 days present, 5 overtime hours
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
    // Sunita Devi (w-102) - 24 days present, 2 overtime hours
    {
      id: 'att-102-1',
      organizationId: 'org-construction',
      workerId: 'w-102',
      period: '2026-10',
      regularDays: 24,
      regularHours: 192,
      approvedOvertimeHours: 2,
      leaveDays: 1,
      status: 'approved',
      source: 'supervisor_log'
    },
    // Rajesh Sharma (w-201) - 20 days present, 14 overtime hours (exceeds threshold)
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
    },
    // Priya Nair (w-202) - 25 days present, 0 overtime hours
    {
      id: 'att-202-1',
      organizationId: 'org-college',
      workerId: 'w-202',
      period: '2026-10',
      regularDays: 25,
      regularHours: 200,
      approvedOvertimeHours: 0,
      leaveDays: 2,
      status: 'approved',
      source: 'biometric_kiosk'
    }
  ],

  payRecords: [
    // Ramesh Kumar (w-101): Expected: ₹13,500. Recorded: ₹12,000 (intentional discrepancy for demo)
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
      },
      updatedAt: '2026-10-16T10:00:00.000Z'
    },
    // Sunita Devi (w-102): Expected: ₹15,850. Recorded: ₹15,850 (matched)
    {
      id: 'pay-102-1',
      organizationId: 'org-construction',
      workerId: 'w-102',
      workerName: 'Sunita Devi',
      periodStart: '2026-10-01',
      periodEnd: '2026-10-15',
      periodLabel: '01 Oct 2026 - 15 Oct 2026 (Fortnight 1)',
      wageType: 'daily',
      baseRate: 650,
      regularUnits: 24,
      approvedOvertimeHours: 2,
      overtimeRate: 125,
      basePay: 15600,
      overtimePay: 250,
      additions: 0,
      deductions: 0,
      expectedNetPay: 15850,
      recordedPayment: 15850,
      currency: 'INR',
      status: 'matched',
      calculationVersion: '1.0.0-deterministic',
      formulaBreakdown: {
        baseFormula: '24 days worked × ₹650/day = ₹15,600',
        overtimeFormula: '2 approved OT hours × ₹125/hr = ₹250',
        deductionsFormula: 'None'
      },
      updatedAt: '2026-10-16T10:00:00.000Z'
    },
    // Rajesh Sharma (w-201): Expected: ₹15,820. Recorded: ₹15,820 (matched)
    {
      id: 'pay-201-1',
      organizationId: 'org-college',
      workerId: 'w-201',
      workerName: 'Rajesh Sharma',
      periodStart: '2026-10-01',
      periodEnd: '2026-10-31',
      periodLabel: 'October 2026 Monthly Cycle',
      wageType: 'daily',
      baseRate: 700,
      regularUnits: 20,
      approvedOvertimeHours: 14,
      overtimeRate: 130,
      basePay: 14000,
      overtimePay: 1820,
      additions: 500,
      deductions: 500,
      expectedNetPay: 15820,
      recordedPayment: 15820,
      currency: 'INR',
      status: 'matched',
      calculationVersion: '1.0.0-deterministic',
      formulaBreakdown: {
        baseFormula: '20 days worked × ₹700/day = ₹14,000',
        overtimeFormula: '14 approved OT hours × ₹130/hr = ₹1,820',
        deductionsFormula: 'PF deduction = -₹500, Tools allowance = +₹500'
      },
      updatedAt: '2026-10-25T10:00:00.000Z'
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
      description: 'Unsafe scaffolding at Block C, 3rd floor. Planks are loose and shifting during heavy shuttering movement, missing toe-boards, and there are no safety catch nets below.',
      aiSummary: 'AI Analysis: High-risk structural fall hazard detected in working at heights. Recommended immediate inspection of scaffold ties and guardrails.',
      assignedReviewerId: 'usr-reviewer-safety',
      assignedReviewerName: 'Kavita Patel',
      resolutionNote: null,
      createdAt: '2026-10-25T08:30:00.000Z',
      updatedAt: '2026-10-26T14:15:00.000Z'
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
      description: 'Wage Discrepancy for Pay Period 1-15 Oct. Expected ₹13,500 based on 22 days @ ₹600 plus 5 OT hours, but recorded payment shows ₹12,000 (shortfall of ₹1,500). Please audit bank disbursement register.',
      aiSummary: 'AI Analysis: Wage discrepancy report. Claims ₹1,500 shortfall on approved overtime and full shift completion.',
      assignedReviewerId: null,
      assignedReviewerName: null,
      resolutionNote: null,
      createdAt: '2026-10-26T09:00:00.000Z',
      updatedAt: '2026-10-26T09:00:00.000Z'
    },
    {
      id: 'grv-003',
      caseNumber: 'KS-COL-2026-003',
      organizationId: 'org-college',
      workerId: 'w-201',
      workerName: 'Rajesh Sharma',
      category: 'safety',
      priority: 'normal',
      status: 'resolved',
      visibility: 'confidential',
      description: 'Chemical vapor smell in Chemistry Lab basement storage; exhaust fan motor is burned out causing dizziness during plumbing inspection.',
      aiSummary: 'AI Analysis: Hazardous chemical vapor ventilation failure in basement storage.',
      assignedReviewerId: 'usr-admin-col',
      assignedReviewerName: 'Dr. Aruna Rao',
      resolutionNote: 'Industrial exhaust fan motor was replaced and tested under load. Air circulation restored and verified safe by Facilities team.',
      createdAt: '2026-10-20T11:00:00.000Z',
      updatedAt: '2026-10-22T16:00:00.000Z'
    }
  ],

  grievanceEvents: [
    {
      id: 'evt-001-1',
      grievanceId: 'grv-001',
      actorId: 'usr-worker-1',
      actorName: 'Ramesh Kumar',
      actorRole: 'worker',
      eventType: 'created',
      fromStatus: null,
      toStatus: 'submitted',
      note: 'Concern submitted via SafeVoice speech-to-text.',
      timestamp: '2026-10-25T08:30:00.000Z'
    },
    {
      id: 'evt-001-2',
      grievanceId: 'grv-001',
      actorId: 'usr-reviewer-safety',
      actorName: 'Kavita Patel',
      actorRole: 'reviewer',
      eventType: 'status_change',
      fromStatus: 'submitted',
      toStatus: 'under_review',
      note: 'Safety hazard acknowledged. Priority confirmed as High.',
      timestamp: '2026-10-25T10:15:00.000Z'
    },
    {
      id: 'evt-001-3',
      grievanceId: 'grv-001',
      actorId: 'usr-reviewer-safety',
      actorName: 'Kavita Patel',
      actorRole: 'reviewer',
      eventType: 'status_change',
      fromStatus: 'under_review',
      toStatus: 'investigating',
      note: 'Assigned site safety supervisor for physical inspection and toe-board retrofitting.',
      timestamp: '2026-10-26T14:15:00.000Z'
    },
    {
      id: 'evt-002-1',
      grievanceId: 'grv-002',
      actorId: 'usr-worker-1',
      actorName: 'Ramesh Kumar',
      actorRole: 'worker',
      eventType: 'created',
      fromStatus: null,
      toStatus: 'submitted',
      note: 'Wage discrepancy automatically pre-filled from FairPay breakdown and confirmed by worker.',
      timestamp: '2026-10-26T09:00:00.000Z'
    },
    {
      id: 'evt-003-1',
      grievanceId: 'grv-003',
      actorId: 'usr-worker-3',
      actorName: 'Rajesh Sharma',
      actorRole: 'worker',
      eventType: 'created',
      fromStatus: null,
      toStatus: 'submitted',
      note: 'Ventilation issue reported.',
      timestamp: '2026-10-20T11:00:00.000Z'
    },
    {
      id: 'evt-003-2',
      grievanceId: 'grv-003',
      actorId: 'usr-admin-col',
      actorName: 'Dr. Aruna Rao',
      actorRole: 'admin',
      eventType: 'status_change',
      fromStatus: 'investigating',
      toStatus: 'resolved',
      note: 'Industrial exhaust fan replaced and tested. Air quality certified normal.',
      timestamp: '2026-10-22T16:00:00.000Z'
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
      suggestedAction: 'Verify site supervisor scaffold safety checklist and toe-board installation.',
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
    },
    {
      id: 'alert-003',
      organizationId: 'org-college',
      type: 'overtime_excess',
      severity: 'medium',
      title: 'Overtime Threshold Exceeded',
      description: 'Rajesh Sharma recorded 14 approved overtime hours this cycle (Campus fatigue policy limit: 12 hours).',
      ruleExplanation: 'Triggered because cumulative overtime exceeded the institutional weekly fatigue limit of 12 hours.',
      relatedRecordId: 'w-201',
      reviewed: false,
      suggestedAction: 'Review maintenance duty roster with technician to prevent fatigue.',
      createdAt: '2026-10-26T08:00:00.000Z'
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
    },
    {
      id: 'sk-101-2',
      workerId: 'w-101',
      organizationId: 'org-construction',
      skillName: 'Height Safety & Harness Operations',
      category: 'Occupational Safety',
      issuer: 'National Safety Council of India',
      issueDate: '2025-01-15',
      expiryDate: '2027-01-15',
      verificationStatus: 'verified',
      verifierNote: 'Completed mandatory safety training',
      isPublicConsentGiven: true
    },
    {
      id: 'sk-102-1',
      workerId: 'w-102',
      organizationId: 'org-construction',
      skillName: 'Industrial Protective Coating & Finishes',
      category: 'Finishing & Painting',
      issuer: 'Asian Paints Skill Academy',
      issueDate: '2024-09-01',
      expiryDate: '2026-09-01',
      verificationStatus: 'verified',
      verifierNote: 'Verified certified applicator',
      isPublicConsentGiven: false
    },
    {
      id: 'sk-201-1',
      workerId: 'w-201',
      organizationId: 'org-college',
      skillName: 'HVAC Chiller & BMS Operations',
      category: 'Facilities Engineering',
      issuer: 'Blue Star Climate Academy',
      issueDate: '2023-11-20',
      expiryDate: '2026-11-20',
      verificationStatus: 'verified',
      verifierNote: 'Campus central plant certification',
      isPublicConsentGiven: true
    }
  ]
};
