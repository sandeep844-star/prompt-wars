import { Router } from 'express';
import { db } from '../models/dataStore.js';
import { requireRole } from '../middleware/auth.js';
import { getRiskRadarSummary, markAlertReviewed } from '../services/riskRadar.service.js';

const router = Router();

// Overview dashboard & Risk Radar
router.get('/summary', requireRole('admin', 'reviewer'), (req, res) => {
  const summary = getRiskRadarSummary(req.user.organizationId);
  res.json({ summary });
});

// Mark an alert reviewed
router.patch('/alerts/:id/review', requireRole('admin', 'reviewer'), (req, res) => {
  try {
    const updated = markAlertReviewed(req.params.id, req.user);
    res.json({
      message: 'Alert marked as reviewed.',
      alert: updated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Demo reset endpoint
router.post('/demo-reset', (req, res) => {
  db.reset();
  res.json({ message: 'KaamSetu demo data has been reset to initial baseline.' });
});

export default router;
