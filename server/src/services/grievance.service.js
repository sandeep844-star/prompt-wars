import { db } from '../models/dataStore.js';

export function generateCaseNumber(industry = 'construction') {
  const prefix = industry === 'college' ? 'KS-COL' : 'KS-CON';
  const year = new Date().getFullYear();
  const allCases = db.getCollection('grievances');
  const count = allCases.length + 1;
  const seq = String(count).padStart(3, '0');
  return `${prefix}-${year}-${seq}`;
}

export function createGrievanceRecord({
  organizationId,
  workerId,
  workerName,
  category = 'other',
  priority = 'normal',
  description,
  aiSummary = null,
  visibility = 'identified',
  industry = 'construction'
}) {
  if (!description || description.trim().length < 5) {
    throw new Error('Description must be at least 5 characters long.');
  }

  const validCategories = ['safety', 'pay', 'hours', 'harassment', 'other'];
  if (!validCategories.includes(category)) {
    throw new Error(`Invalid category: ${category}. Allowed: ${validCategories.join(', ')}`);
  }

  const caseNumber = generateCaseNumber(industry);
  const grievance = db.create('grievances', {
    caseNumber,
    organizationId,
    workerId: visibility === 'anonymous' ? null : workerId,
    workerName: visibility === 'anonymous' ? 'Anonymous Worker' : workerName,
    category,
    priority,
    status: 'submitted',
    visibility,
    description: description.trim(),
    aiSummary,
    assignedReviewerId: null,
    assignedReviewerName: null,
    resolutionNote: null
  });

  // Log creation timeline event
  db.create('grievanceEvents', {
    grievanceId: grievance.id,
    actorId: workerId,
    actorName: visibility === 'anonymous' ? 'Anonymous' : (workerName || 'Worker'),
    actorRole: 'worker',
    eventType: 'created',
    fromStatus: null,
    toStatus: 'submitted',
    note: 'Concern submitted and case number generated.',
    timestamp: new Date().toISOString()
  });

  // Automatically trigger a Risk Alert if High or Urgent priority
  if (priority === 'high' || priority === 'urgent') {
    db.create('riskAlerts', {
      organizationId,
      type: category === 'safety' ? 'safety_hazard' : 'critical_concern',
      severity: priority === 'urgent' ? 'high' : 'medium',
      title: `${category.toUpperCase()} Concern: Case ${caseNumber}`,
      description: description.slice(0, 120) + (description.length > 120 ? '...' : ''),
      ruleExplanation: `Automated alert triggered because an unresolved ${priority.toUpperCase()} priority ${category} concern was lodged.`,
      relatedRecordId: grievance.id,
      reviewed: false,
      suggestedAction: 'Review worker statement and assign designated safety/grievance officer.',
      createdAt: new Date().toISOString()
    });
  }

  return getGrievanceWithTimeline(grievance.id);
}

export function updateGrievanceStatus({
  grievanceId,
  actor,
  toStatus,
  note,
  assignedReviewerId,
  assignedReviewerName
}) {
  const grievance = db.findById('grievances', grievanceId);
  if (!grievance) {
    throw new Error(`Grievance not found: ${grievanceId}`);
  }

  const validStatuses = ['submitted', 'under_review', 'investigating', 'resolved', 'reopened'];
  if (!validStatuses.includes(toStatus)) {
    throw new Error(`Invalid status: ${toStatus}. Allowed: ${validStatuses.join(', ')}`);
  }

  if (toStatus === 'resolved' && (!note || note.trim().length < 5)) {
    throw new Error('A detailed resolution note (at least 5 characters) is required when marking a case resolved.');
  }

  const fromStatus = grievance.status;
  const updates = {
    status: toStatus
  };

  if (assignedReviewerId) {
    updates.assignedReviewerId = assignedReviewerId;
    updates.assignedReviewerName = assignedReviewerName || actor.displayName;
  }

  if (toStatus === 'resolved') {
    updates.resolutionNote = note.trim();
  }

  const updatedGrievance = db.update('grievances', grievanceId, updates);

  // Log timeline event
  db.create('grievanceEvents', {
    grievanceId,
    actorId: actor.id,
    actorName: actor.displayName,
    actorRole: actor.role,
    eventType: 'status_change',
    fromStatus,
    toStatus,
    note: note ? note.trim() : `Status transitioned from ${fromStatus} to ${toStatus}.`,
    timestamp: new Date().toISOString()
  });

  return getGrievanceWithTimeline(grievanceId);
}

export function addGrievanceNote({ grievanceId, actor, note }) {
  const grievance = db.findById('grievances', grievanceId);
  if (!grievance) {
    throw new Error(`Grievance not found: ${grievanceId}`);
  }

  if (!note || note.trim().length < 2) {
    throw new Error('Note text cannot be empty.');
  }

  const event = db.create('grievanceEvents', {
    grievanceId,
    actorId: actor.id,
    actorName: actor.displayName,
    actorRole: actor.role,
    eventType: 'internal_note',
    fromStatus: grievance.status,
    toStatus: grievance.status,
    note: note.trim(),
    timestamp: new Date().toISOString()
  });

  return event;
}

export function getGrievanceWithTimeline(grievanceId) {
  const grievance = db.findById('grievances', grievanceId);
  if (!grievance) return null;

  const events = db.find('grievanceEvents', { grievanceId })
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    ...grievance,
    timeline: events
  };
}
