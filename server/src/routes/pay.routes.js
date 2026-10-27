import { Router } from 'express';
import { db } from '../models/dataStore.js';
import { calculateFairWage } from '../services/fairpay.service.js';
import { createGrievanceRecord } from '../services/grievance.service.js';

const router = Router();

// Calculate deterministic wage preview from inputs
router.post('/preview', (req, res) => {
  try {
    const {
      wageType,
      baseRate,
      regularUnits,
      approvedOvertimeHours,
      overtimeRate,
      additions,
      deductions,
      recordedPayment,
      currency
    } = req.body;

    const calculation = calculateFairWage({
      wageType,
      baseRate,
      regularUnits,
      approvedOvertimeHours,
      overtimeRate,
      additions,
      deductions,
      recordedPayment,
      currency
    });

    res.json({ calculation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Flag discrepancy on an existing pay record and optionally generate grievance
router.post('/:id/flag-discrepancy', (req, res) => {
  try {
    const { id } = req.params;
    const { workerStatement } = req.body;

    const payRecord = db.findById('payRecords', id);
    if (!payRecord) {
      return res.status(404).json({ error: 'Pay record not found.' });
    }

    if (payRecord.organizationId !== req.user.organizationId) {
      return res.status(403).json({ error: 'Cannot flag discrepancy across organizations.' });
    }

    const org = db.findById('organizations', req.user.organizationId);
    const worker = db.findById('workers', payRecord.workerId);

    const diff = payRecord.recordedPayment - payRecord.expectedNetPay;
    const defaultDescription = workerStatement || 
      `Wage discrepancy flagged for period ${payRecord.periodLabel || 'recent cycle'}. Recorded payment of ₹${payRecord.recordedPayment} differs from expected net pay of ₹${payRecord.expectedNetPay} (Difference: ₹${diff}).`;

    // Create a grievance automatically linked to this discrepancy
    const grievance = createGrievanceRecord({
      organizationId: req.user.organizationId,
      workerId: payRecord.workerId,
      workerName: worker ? worker.displayName : req.user.displayName,
      category: 'pay',
      priority: 'normal',
      description: defaultDescription,
      aiSummary: `AI Summary: Discrepancy report regarding ₹${Math.abs(diff)} gap on ${payRecord.periodLabel || 'pay period'}.`,
      visibility: 'identified',
      industry: org ? org.industry : 'construction'
    });

    // Update pay record status
    const updatedPayRecord = db.update('payRecords', id, {
      status: 'discrepancy_flagged',
      flaggedGrievanceId: grievance.id
    });

    res.json({
      message: 'Discrepancy flagged and grievance case created successfully.',
      payRecord: updatedPayRecord,
      grievance
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
