/**
 * FairPay Service - Deterministic, pure wage arithmetic.
 * Ensures transparent, audit-ready pay calculation across industries (Construction, College).
 */

export function validateNumber(value, fieldName, { allowNegative = false, min = 0 } = {}) {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Validation Error: '${fieldName}' must be a valid number. Received: ${value}`);
  }
  if (!allowNegative && num < min) {
    throw new Error(`Validation Error: '${fieldName}' cannot be less than ${min}. Received: ${num}`);
  }
  return num;
}

/**
 * Calculates fair wage deterministically.
 * @param {Object} params
 * @param {'daily'|'hourly'|'monthly'} params.wageType
 * @param {number} params.baseRate - Daily rate, hourly rate, or monthly base
 * @param {number} params.regularUnits - Number of days or hours worked
 * @param {number} [params.approvedOvertimeHours=0] - Approved overtime hours
 * @param {number} [params.overtimeRate=0] - Hourly overtime rate
 * @param {number} [params.additions=0] - Bonuses, allowances, or travel stipends
 * @param {number} [params.deductions=0] - Statutory or approved deductions (PF, advances, mess)
 * @param {number} [params.recordedPayment=null] - Optional employer recorded disbursement
 * @param {string} [params.currency='INR']
 */
export function calculateFairWage({
  wageType = 'daily',
  baseRate,
  regularUnits,
  approvedOvertimeHours = 0,
  overtimeRate = 0,
  additions = 0,
  deductions = 0,
  recordedPayment = null,
  currency = 'INR'
}) {
  const rate = validateNumber(baseRate, 'baseRate', { min: 0 });
  const units = validateNumber(regularUnits, 'regularUnits', { min: 0 });
  const otHours = validateNumber(approvedOvertimeHours, 'approvedOvertimeHours', { min: 0 });
  const otRate = validateNumber(overtimeRate, 'overtimeRate', { min: 0 });
  const adds = validateNumber(additions, 'additions', { min: 0 });
  const deds = validateNumber(deductions, 'deductions', { min: 0 });

  let basePay = 0;
  let calculationNote = '';

  if (wageType === 'daily') {
    basePay = Math.round(units * rate * 100) / 100;
    calculationNote = `${units} days worked × ₹${rate}/day`;
  } else if (wageType === 'hourly') {
    basePay = Math.round(units * rate * 100) / 100;
    calculationNote = `${units} regular hours × ₹${rate}/hr`;
  } else if (wageType === 'monthly') {
    basePay = Math.round(rate * 100) / 100;
    calculationNote = `Fixed monthly base: ₹${rate}`;
  } else {
    throw new Error(`Unsupported wage type: ${wageType}. Supported types: daily, hourly, monthly.`);
  }

  const overtimePay = Math.round(otHours * otRate * 100) / 100;
  const overtimeNote = otHours > 0 
    ? `${otHours} approved OT hours × ₹${otRate}/hr`
    : 'No overtime recorded';

  const grossPay = Math.round((basePay + overtimePay + adds) * 100) / 100;
  const expectedNetPay = Math.round((grossPay - deds) * 100) / 100;

  // Comparison with recorded payment
  let discrepancy = null;
  if (recordedPayment !== null && recordedPayment !== undefined) {
    const recorded = validateNumber(recordedPayment, 'recordedPayment', { min: 0 });
    const diff = Math.round((recorded - expectedNetPay) * 100) / 100;
    const hasDiscrepancy = Math.abs(diff) >= 1; // within 1 rupee tolerance for roundings

    let status = 'matched';
    let message = 'Payment matches expected net wage.';

    if (hasDiscrepancy) {
      if (diff < 0) {
        status = 'underpaid';
        message = `Recorded payment (₹${recorded}) is ₹${Math.abs(diff)} lower than expected (₹${expectedNetPay}).`;
      } else {
        status = 'overpaid';
        message = `Recorded payment (₹${recorded}) exceeds expected net calculation by ₹${diff}.`;
      }
    }

    discrepancy = {
      recordedPayment: recorded,
      difference: diff,
      hasDiscrepancy,
      status,
      message,
      canFlagGrievance: hasDiscrepancy && diff < 0
    };
  }

  return {
    wageType,
    currency,
    inputs: {
      baseRate: rate,
      regularUnits: units,
      approvedOvertimeHours: otHours,
      overtimeRate: otRate,
      additions: adds,
      deductions: deds
    },
    breakdown: {
      basePay,
      basePayFormula: calculationNote,
      overtimePay,
      overtimeFormula: overtimeNote,
      grossPay,
      additions: adds,
      deductions: deds,
      expectedNetPay
    },
    explanation: [
      `Base wage calculation: ${calculationNote} = ₹${basePay}`,
      otHours > 0 ? `Overtime calculation: ${overtimeNote} = ₹${overtimePay}` : `Overtime: none`,
      adds > 0 ? `Approved additions/allowances: +₹${adds}` : null,
      deds > 0 ? `Approved deductions (PF/Advance): -₹${deds}` : null,
      `Expected total net pay: ₹${expectedNetPay}`
    ].filter(Boolean),
    discrepancy,
    calculationVersion: '1.0.0-deterministic',
    calculatedAt: new Date().toISOString()
  };
}
