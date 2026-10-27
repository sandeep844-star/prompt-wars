import { Router } from 'express';
import { db } from '../models/dataStore.js';
import { requireRole } from '../middleware/auth.js';
import { calculateFairWage } from '../services/fairpay.service.js';

const router = Router();

// Worker's own endpoints
router.get('/me', (req, res) => {
  if (!req.user?.workerId) {
    return res.status(404).json({ error: 'User does not have an associated worker profile.' });
  }

  const worker = db.findById('workers', req.user.workerId);
  res.json({ worker });
});

router.get('/me/attendance', (req, res) => {
  if (!req.user?.workerId) {
    return res.status(404).json({ error: 'Worker profile not found.' });
  }

  const records = db.find('attendanceRecords', {
    workerId: req.user.workerId,
    organizationId: req.user.organizationId
  });

  res.json({ attendance: records });
});

router.get('/me/pay', (req, res) => {
  if (!req.user?.workerId) {
    return res.status(404).json({ error: 'Worker profile not found.' });
  }

  const records = db.find('payRecords', {
    workerId: req.user.workerId,
    organizationId: req.user.organizationId
  });

  // Re-verify deterministic breakdown for each record
  const enriched = records.map(p => {
    const calc = calculateFairWage({
      wageType: p.wageType,
      baseRate: p.baseRate,
      regularUnits: p.regularUnits,
      approvedOvertimeHours: p.approvedOvertimeHours,
      overtimeRate: p.overtimeRate,
      additions: p.additions,
      deductions: p.deductions,
      recordedPayment: p.recordedPayment,
      currency: p.currency
    });
    return {
      ...p,
      verifiedCalculation: calc
    };
  });

  res.json({ payRecords: enriched });
});

router.get('/me/skills', (req, res) => {
  if (!req.user?.workerId) {
    return res.status(404).json({ error: 'Worker profile not found.' });
  }

  const skills = db.find('skills', {
    workerId: req.user.workerId,
    organizationId: req.user.organizationId
  });

  res.json({ skills });
});

router.patch('/me/skills/:id/consent', (req, res) => {
  const { id } = req.params;
  const { isPublicConsentGiven } = req.body;

  const skill = db.findById('skills', id);
  if (!skill) {
    return res.status(404).json({ error: 'Skill record not found.' });
  }

  if (skill.workerId !== req.user.workerId) {
    return res.status(403).json({ error: 'Cannot modify skill consent for another worker.' });
  }

  const updated = db.update('skills', id, {
    isPublicConsentGiven: Boolean(isPublicConsentGiven)
  });

  res.json({ skill: updated });
});

// Admin / Reviewer endpoints for workforce inspection
router.get('/', requireRole('admin', 'reviewer'), (req, res) => {
  const workers = db.find('workers', { organizationId: req.user.organizationId });
  res.json({ workers });
});

router.get('/:id', requireRole('admin', 'reviewer'), (req, res) => {
  const worker = db.findById('workers', req.params.id);
  if (!worker || worker.organizationId !== req.user.organizationId) {
    return res.status(404).json({ error: 'Worker not found in current organization.' });
  }
  res.json({ worker });
});

router.get('/:id/attendance', requireRole('admin', 'reviewer'), (req, res) => {
  const worker = db.findById('workers', req.params.id);
  if (!worker || worker.organizationId !== req.user.organizationId) {
    return res.status(404).json({ error: 'Worker not found in current organization.' });
  }

  const attendance = db.find('attendanceRecords', {
    workerId: req.params.id,
    organizationId: req.user.organizationId
  });

  res.json({ attendance });
});

router.get('/:id/pay', requireRole('admin', 'reviewer'), (req, res) => {
  const worker = db.findById('workers', req.params.id);
  if (!worker || worker.organizationId !== req.user.organizationId) {
    return res.status(404).json({ error: 'Worker not found in current organization.' });
  }

  const payRecords = db.find('payRecords', {
    workerId: req.params.id,
    organizationId: req.user.organizationId
  });

  res.json({ payRecords });
});

export default router;
