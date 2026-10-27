import { Router } from 'express';
import { db } from '../models/dataStore.js';

const router = Router();

/**
 * Validates that an email ends with @gmail.com and matches standard email format.
 */
export function validateGmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== 'string' || !rawEmail.trim()) {
    return { valid: false, error: 'Please enter your Gmail address.' };
  }

  const trimmed = rawEmail.trim();
  const normalized = trimmed.toLowerCase();

  // Must be standard format ending with @gmail.com
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(trimmed)) {
    return { valid: false, error: 'Enter a valid Gmail address ending in @gmail.com.' };
  }

  return { valid: true, normalized };
}

// Get current authenticated user context
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const organization = db.findById('organizations', req.user.organizationId);
  const workerProfile = req.user.workerId ? db.findById('workers', req.user.workerId) : null;

  res.json({
    user: req.user,
    organization,
    workerProfile
  });
});

// Demo persona switch login
router.post('/demo-login', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  const user = db.findById('users', userId);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found.' });
  }

  const organization = db.findById('organizations', user.organizationId);
  const workerProfile = user.workerId ? db.findById('workers', user.workerId) : null;

  res.json({
    message: 'Demo login successful.',
    user,
    organization,
    workerProfile
  });
});

// Gmail login endpoint: Accepts any valid Gmail address
router.post('/gmail-login', (req, res) => {
  const { email } = req.body;
  const validation = validateGmail(email);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const normalizedEmail = validation.normalized;

  // 1. Check if user already exists with this email
  const allUsers = db.getCollection('users');
  let user = allUsers.find(u => u.email && u.email.toLowerCase() === normalizedEmail);

  let isNewUser = false;

  // 2. If not found, dynamically create a new worker account with restricted default role
  if (!user) {
    isNewUser = true;
    const namePart = normalizedEmail.split('@')[0].replace(/[._+-]+/g, ' ');
    const displayName = namePart
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Google User';

    const newWorkerId = `w-gm-${Date.now().toString().slice(-4)}`;
    const worker = db.create('workers', {
      id: newWorkerId,
      organizationId: 'org-construction',
      displayName,
      departmentOrSite: 'Sector 7 Viaduct',
      jobRole: 'Field Craftsman',
      wageType: 'daily',
      baseRate: 600,
      overtimeRate: 120,
      active: true,
      joinedDate: new Date().toISOString().split('T')[0]
    });

    user = db.create('users', {
      id: `usr-gm-${Date.now()}`,
      email: normalizedEmail,
      displayName,
      role: 'worker', // Restricted default role per security guidelines
      title: 'Field Craftsman',
      organizationId: 'org-construction',
      workerId: worker.id,
      preferredLanguage: 'en',
      active: true,
      authProvider: 'gmail_prototype',
      isPrototypeGmail: true
    });

    // Seed initial verified shift & pay records so new account has immediate FairPay data
    db.create('attendanceRecords', {
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

    db.create('payRecords', {
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
  }

  const organization = db.findById('organizations', user.organizationId);
  const workerProfile = user.workerId ? db.findById('workers', user.workerId) : null;

  res.json({
    message: isNewUser ? 'Account created and signed in successfully.' : 'Welcome back! Signed in successfully.',
    user,
    organization,
    workerProfile,
    isPrototype: true,
    isNewUser
  });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// List all demo personas
router.get('/demo-users', (req, res) => {
  const users = db.getCollection('users');
  const orgs = db.getCollection('organizations');

  const populated = users.map(u => ({
    ...u,
    organization: orgs.find(o => o.id === u.organizationId)
  }));

  res.json({ users: populated });
});

export default router;
