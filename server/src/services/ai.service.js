/**
 * SafeVoice AI Assistant & Classification Service
 * Provides plain-language summarization and category suggestion.
 * Follows AI-as-assistant guidelines: results are transparently labeled
 * as suggestions and require worker confirmation prior to submission.
 */

export async function classifyAndSummarizeGrievance(text = '') {
  const content = (text || '').trim();
  if (!content) {
    return {
      suggestedCategory: 'other',
      suggestedPriority: 'normal',
      summary: 'No text provided.',
      isFallback: true
    };
  }

  const lower = content.toLowerCase();

  // Pattern detection for categories
  let category = 'other';
  let priority = 'normal';
  let matchedKeywords = [];

  const safetyKeywords = ['unsafe', 'hazard', 'scaffold', 'fall', 'hurt', 'injury', 'danger', 'chemical', 'fume', 'fire', 'electric', 'shock', 'broken', 'mask', 'helmet', 'harness', 'net', 'dizzy', 'ventil'];
  const payKeywords = ['wage', 'salary', 'payment', 'paid', 'cut', 'shortfall', 'deduct', 'rate', 'money', 'paisa', 'ot', 'overtime pay', 'rupees', 'discrepancy'];
  const hoursKeywords = ['overtime', 'hours', 'shift', 'night shift', 'double shift', 'rest', 'break', 'sunday', 'late', 'extended'];
  const harassmentKeywords = ['abuse', 'harass', 'yell', 'threat', 'unsafe conduct', 'discrimination', 'bribe'];

  const foundSafety = safetyKeywords.filter(k => lower.includes(k));
  const foundPay = payKeywords.filter(k => lower.includes(k));
  const foundHours = hoursKeywords.filter(k => lower.includes(k));
  const foundHarassment = harassmentKeywords.filter(k => lower.includes(k));

  if (foundSafety.length > 0) {
    category = 'safety';
    matchedKeywords = foundSafety;
    if (lower.includes('urgent') || lower.includes('fall') || lower.includes('chemical') || lower.includes('hazard') || lower.includes('scaffold')) {
      priority = 'high';
    }
  } else if (foundPay.length > 0) {
    category = 'pay';
    matchedKeywords = foundPay;
    priority = 'normal';
  } else if (foundHours.length > 0) {
    category = 'hours';
    matchedKeywords = foundHours;
    priority = 'normal';
  } else if (foundHarassment.length > 0) {
    category = 'harassment';
    matchedKeywords = foundHarassment;
    priority = 'high';
  }

  // Generate plain-language structured summary
  let summary = '';
  if (category === 'safety') {
    summary = `Reported safety hazard concerning physical workplace conditions (${matchedKeywords.slice(0, 3).join(', ')}). Immediate mitigation recommended.`;
  } else if (category === 'pay') {
    summary = `Reported wage or deduction issue (${matchedKeywords.slice(0, 3).join(', ')}). Requires payroll records verification.`;
  } else if (category === 'hours') {
    summary = `Reported working hours or overtime schedule concern (${matchedKeywords.slice(0, 3).join(', ')}).`;
  } else if (category === 'harassment') {
    summary = `Sensitive workplace conduct or harassment report. Handled with confidential escalation.`;
  } else {
    summary = `General workplace report: ${content.slice(0, 80)}...`;
  }

  return {
    suggestedCategory: category,
    suggestedPriority: priority,
    summary,
    explanation: matchedKeywords.length > 0
      ? `AI suggested '${category}' based on keywords: [${matchedKeywords.join(', ')}]. You can change this before submitting.`
      : 'General classification applied. Please verify the category before submitting.',
    isAiGenerated: true,
    confidence: matchedKeywords.length > 1 ? 0.92 : 0.78
  };
}
