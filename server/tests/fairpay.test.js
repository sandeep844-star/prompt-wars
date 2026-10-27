import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateFairWage } from '../src/services/fairpay.service.js';

describe('FairPay Service - Deterministic Wage Calculations', () => {
  it('correctly calculates daily wage with overtime, additions, and deductions (Worker A Demo Case)', () => {
    // Ramesh Kumar: 22 days @ ₹600/day, 5 approved OT hours @ ₹120/hr, ₹0 additions, ₹300 deductions
    const result = calculateFairWage({
      wageType: 'daily',
      baseRate: 600,
      regularUnits: 22,
      approvedOvertimeHours: 5,
      overtimeRate: 120,
      additions: 0,
      deductions: 300,
      recordedPayment: 12000
    });

    // 22 * 600 = 13200
    assert.strictEqual(result.breakdown.basePay, 13200);
    // 5 * 120 = 600
    assert.strictEqual(result.breakdown.overtimePay, 600);
    // Gross: 13200 + 600 = 13800
    assert.strictEqual(result.breakdown.grossPay, 13800);
    // Net: 13800 - 300 = 13500
    assert.strictEqual(result.breakdown.expectedNetPay, 13500);

    // Discrepancy: recorded 12000 vs expected 13500 => underpaid by 1500
    assert.strictEqual(result.discrepancy.hasDiscrepancy, true);
    assert.strictEqual(result.discrepancy.difference, -1500);
    assert.strictEqual(result.discrepancy.status, 'underpaid');
    assert.strictEqual(result.discrepancy.canFlagGrievance, true);
  });

  it('correctly calculates hourly wage for shift workers', () => {
    const result = calculateFairWage({
      wageType: 'hourly',
      baseRate: 150,
      regularUnits: 80,
      approvedOvertimeHours: 10,
      overtimeRate: 200,
      additions: 500,
      deductions: 200,
      recordedPayment: 14300
    });

    // Base: 80 * 150 = 12000
    assert.strictEqual(result.breakdown.basePay, 12000);
    // Overtime: 10 * 200 = 2000
    assert.strictEqual(result.breakdown.overtimePay, 2000);
    // Gross: 12000 + 2000 + 500 = 14500
    assert.strictEqual(result.breakdown.grossPay, 14500);
    // Net: 14500 - 200 = 14300
    assert.strictEqual(result.breakdown.expectedNetPay, 14300);

    // Matched payment
    assert.strictEqual(result.discrepancy.hasDiscrepancy, false);
    assert.strictEqual(result.discrepancy.status, 'matched');
  });

  it('correctly calculates monthly wage for institutional college staff', () => {
    const result = calculateFairWage({
      wageType: 'monthly',
      baseRate: 22000,
      regularUnits: 1,
      approvedOvertimeHours: 8,
      overtimeRate: 150,
      additions: 1000,
      deductions: 1800,
      recordedPayment: 22400
    });

    // Base: 22000
    assert.strictEqual(result.breakdown.basePay, 22000);
    // Overtime: 8 * 150 = 1200
    assert.strictEqual(result.breakdown.overtimePay, 1200);
    // Net: (22000 + 1200 + 1000) - 1800 = 22400
    assert.strictEqual(result.breakdown.expectedNetPay, 22400);
    assert.strictEqual(result.discrepancy.hasDiscrepancy, false);
  });

  it('rejects negative numbers and invalid inputs with clear validation errors', () => {
    assert.throws(() => {
      calculateFairWage({
        wageType: 'daily',
        baseRate: -500,
        regularUnits: 10
      });
    }, /Validation Error: 'baseRate' cannot be less than 0/);

    assert.throws(() => {
      calculateFairWage({
        wageType: 'daily',
        baseRate: 500,
        regularUnits: -5
      });
    }, /Validation Error: 'regularUnits' cannot be less than 0/);

    assert.throws(() => {
      calculateFairWage({
        wageType: 'invalid_type',
        baseRate: 500,
        regularUnits: 5
      });
    }, /Unsupported wage type/);
  });
});
