import { Router } from 'express';
import { db } from '../models/dataStore.js';
import { requireRole } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import {
  createGrievanceRecord,
  updateGrievanceStatus,
  addGrievanceNote,
  getGrievanceWithTimeline
} from '../services/grievance.service.js';
import { classifyAndSummarizeGrievance } from '../services/ai.service.js';

const router = Router();

// Submit a grievance
router.post('/', rateLimit({ windowMs: 30000, max: 10 }), (req, res) => {
  try {
    const {
      category,
      priority,
      description,
      aiSummary,
      visibility
    } = req.body;

    const org = db.findById('organizations', req.user.organizationId);

    const result = createGrievanceRecord({
      organizationId: req.user.organizationId,
      workerId: req.user.workerId || req.user.id,
      workerName: req.user.displayName,
      category,
      priority,
      description,
      aiSummary,
      visibility: visibility || 'identified',
      industry: org ? org.industry : 'construction'
    });

    res.status(201).json({
      message: 'Grievance submitted successfully.',
      grievance: result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Worker views their own grievances
router.get('/mine', (req, res) => {
  const workerIdentifier = req.user.workerId || req.user.id;
  const grievances = db.find('grievances', {
    organizationId: req.user.organizationId,
    workerId: workerIdentifier
  });

  const withTimeline = grievances.map(g => getGrievanceWithTimeline(g.id));
  res.json({ grievances: withTimeline });
});

// Admin / Reviewer views all organization grievances
router.get('/', requireRole('admin', 'reviewer'), (req, res) => {
  const { category, status, priority } = req.query;
  let grievances = db.find('grievances', { organizationId: req.user.organizationId });

  if (category) {
    grievances = grievances.filter(g => g.category === category);
  }
  if (status) {
    grievances = grievances.filter(g => g.status === status);
  }
  if (priority) {
    grievances = grievances.filter(g => g.priority === priority);
  }

  const withTimeline = grievances.map(g => getGrievanceWithTimeline(g.id));
  res.json({ grievances: withTimeline });
});

// Get single grievance with complete timeline
router.get('/:id', (req, res) => {
  const item = getGrievanceWithTimeline(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Grievance not found.' });
  }

  // Isolation check: must be in same organization
  if (item.organizationId !== req.user.organizationId) {
    return res.status(403).json({ error: 'Access denied to records from other organizations.' });
  }

  // If worker, must own the grievance (unless submitted anonymously without workerId)
  if (req.user.role === 'worker' && item.workerId && item.workerId !== (req.user.workerId || req.user.id)) {
    return res.status(403).json({ error: 'Access denied: You can only view your own grievances.' });
  }

  res.json({ grievance: item });
});

// Update status (Admin / Reviewer)
router.patch('/:id/status', requireRole('admin', 'reviewer'), (req, res) => {
  try {
    const { toStatus, note, assignedReviewerId, assignedReviewerName } = req.body;
    const result = updateGrievanceStatus({
      grievanceId: req.params.id,
      actor: req.user,
      toStatus,
      note,
      assignedReviewerId,
      assignedReviewerName
    });

    res.json({
      message: `Status updated to ${toStatus}.`,
      grievance: result
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add internal note to case timeline
router.post('/:id/notes', requireRole('admin', 'reviewer'), (req, res) => {
  try {
    const { note } = req.body;
    const event = addGrievanceNote({
      grievanceId: req.params.id,
      actor: req.user,
      note
    });

    res.json({
      message: 'Note added to timeline.',
      event
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// SafeVoice AI classification & summarization endpoint
router.post('/ai-classify', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await classifyAndSummarizeGrievance(text);
    res.json({ suggestion: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
