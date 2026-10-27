import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../src/app.js';
import { db } from '../src/models/dataStore.js';

let server;
let baseUrl;

describe('KaamSetu API Integration Tests', () => {
  before(async () => {
    // Reset data before testing
    db.reset();
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(() => {
    if (server) server.close();
  });

  it('Health check returns ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
  });

  it('Demo users endpoint lists available test personas', async () => {
    const res = await fetch(`${baseUrl}/api/auth/demo-users`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.users));
    assert.ok(data.users.length >= 4);
  });

  it('Worker can retrieve own attendance and verified FairPay calculation', async () => {
    // Worker Ramesh Kumar (usr-worker-1)
    const res = await fetch(`${baseUrl}/api/workers/me/pay`, {
      headers: { 'x-demo-user-id': 'usr-worker-1' }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.payRecords));
    assert.ok(data.payRecords.length > 0);

    const first = data.payRecords[0];
    assert.strictEqual(first.expectedNetPay, 13500);
    assert.strictEqual(first.recordedPayment, 12000);
    assert.strictEqual(first.status, 'discrepancy_flagged');
    assert.strictEqual(first.verifiedCalculation.discrepancy.hasDiscrepancy, true);
  });

  it('Worker is blocked with 403 when trying to access admin dashboard', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard/summary`, {
      headers: { 'x-demo-user-id': 'usr-worker-1' } // role: worker
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.match(data.error, /Access Denied/);
  });

  it('Admin can access Risk Radar summary and alerts', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard/summary`, {
      headers: { 'x-demo-user-id': 'usr-admin-con' } // role: admin
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.summary.metrics.activeWorkers > 0);
    assert.ok(Array.isArray(data.summary.alerts));
  });

  it('Worker can submit a new grievance and receive a formatted case ID', async () => {
    const res = await fetch(`${baseUrl}/api/grievances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-demo-user-id': 'usr-worker-1'
      },
      body: JSON.stringify({
        category: 'safety',
        priority: 'high',
        description: 'Missing safety harness anchor points on the overhead gantry.',
        visibility: 'identified'
      })
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data.grievance.caseNumber.startsWith('KS-CON-2026-'));
    assert.strictEqual(data.grievance.status, 'submitted');
    assert.strictEqual(data.grievance.timeline.length, 1);
  });

  it('Admin can update grievance status with audit notes', async () => {
    // Update grv-002 to under_review
    const res = await fetch(`${baseUrl}/api/grievances/grv-002/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-demo-user-id': 'usr-admin-con'
      },
      body: JSON.stringify({
        toStatus: 'under_review',
        note: 'Site manager has contacted payroll to cross-verify shift sheet.'
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.grievance.status, 'under_review');
    const latestEvent = data.grievance.timeline[data.grievance.timeline.length - 1];
    assert.strictEqual(latestEvent.toStatus, 'under_review');
  });

  it('AI helper endpoint returns structured suggestion without throwing', async () => {
    const res = await fetch(`${baseUrl}/api/grievances/ai-classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-demo-user-id': 'usr-worker-1'
      },
      body: JSON.stringify({
        text: 'The chemical fumes in the basement tank are causing severe dizziness and no masks are provided.'
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.suggestion.suggestedCategory, 'safety');
    assert.strictEqual(data.suggestion.suggestedPriority, 'high');
  });

  // --- Gmail Authentication Suite ---
  it('Gmail login rejects empty input', async () => {
    const res = await fetch(`${baseUrl}/api/auth/gmail-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '' })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Please enter your Gmail address.');
  });

  it('Gmail login rejects non-Gmail address or malformed email', async () => {
    const res1 = await fetch(`${baseUrl}/api/auth/gmail-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sandeep@yahoo.com' })
    });
    assert.strictEqual(res1.status, 400);
    const data1 = await res1.json();
    assert.strictEqual(data1.error, 'Enter a valid Gmail address ending in @gmail.com.');

    const res2 = await fetch(`${baseUrl}/api/auth/gmail-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' })
    });
    assert.strictEqual(res2.status, 400);
  });

  it('Gmail login succeeds for existing demo user by email (case-insensitive & trimmed)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/gmail-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '  Ramesh.Kumar@gmail.com  ' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.user.id, 'usr-worker-1');
    assert.strictEqual(data.user.displayName, 'Ramesh Kumar');
    assert.strictEqual(data.isNewUser, false);
  });

  it('Gmail login dynamically provisions new worker account for any valid arbitrary Gmail', async () => {
    const testEmail = `sandeep.test.${Date.now()}@gmail.com`;
    const res = await fetch(`${baseUrl}/api/auth/gmail-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.user.id.startsWith('usr-gm-'));
    assert.strictEqual(data.user.email, testEmail.toLowerCase());
    assert.strictEqual(data.user.role, 'worker'); // Restricted default worker role
    assert.strictEqual(data.isNewUser, true);
    assert.ok(data.workerProfile);
  });

  it('Logout endpoint succeeds', async () => {
    const res = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.message, 'Logged out successfully.');
  });
});
