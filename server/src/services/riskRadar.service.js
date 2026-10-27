import { db } from '../models/dataStore.js';

export function getRiskRadarSummary(organizationId) {
  const org = db.findById('organizations', organizationId);
  const orgWorkers = db.find('workers', { organizationId });
  const orgGrievances = db.find('grievances', { organizationId });
  const orgPayRecords = db.find('payRecords', { organizationId });
  const orgAlerts = db.find('riskAlerts', { organizationId });

  const activeWorkersCount = orgWorkers.filter(w => w.active).length;
  const openGrievances = orgGrievances.filter(g => g.status !== 'resolved');
  const discrepancies = orgPayRecords.filter(p => p.status === 'discrepancy_flagged');
  const pendingAlerts = orgAlerts.filter(a => !a.reviewed);

  return {
    organization: {
      id: org?.id,
      name: org?.name,
      industry: org?.industry
    },
    metrics: {
      activeWorkers: activeWorkersCount,
      openGrievancesCount: openGrievances.length,
      discrepanciesCount: discrepancies.length,
      pendingAlertsCount: pendingAlerts.length,
      totalAlertsCount: orgAlerts.length
    },
    alerts: orgAlerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    openGrievancesQueue: openGrievances.map(g => ({
      id: g.id,
      caseNumber: g.caseNumber,
      workerName: g.workerName,
      category: g.category,
      priority: g.priority,
      status: g.status,
      createdAt: g.createdAt,
      description: g.description
    })),
    discrepancyQueue: discrepancies.map(p => ({
      id: p.id,
      workerName: p.workerName,
      periodLabel: p.periodLabel,
      expectedNetPay: p.expectedNetPay,
      recordedPayment: p.recordedPayment,
      difference: p.recordedPayment - p.expectedNetPay,
      status: p.status
    }))
  };
}

export function markAlertReviewed(alertId, actor) {
  const alert = db.findById('riskAlerts', alertId);
  if (!alert) {
    throw new Error(`Risk alert not found: ${alertId}`);
  }

  return db.update('riskAlerts', alertId, {
    reviewed: true,
    reviewedBy: actor.displayName,
    reviewedAt: new Date().toISOString()
  });
}
