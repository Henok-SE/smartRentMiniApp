/**
 * Formats a number as Ethiopian Birr (ETB)
 * @param {number|string} amount
 * @param {string} currency - default 'ETB'
 * @returns {string} formatted string e.g. "12,000.00 ETB"
 */
export function formatCurrency(amount, currency = 'ETB') {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return `0.00 ${currency}`;
  }
  const formatted = new Intl.NumberFormat('en-ET', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
  return `${formatted} ${currency}`;
}

/**
 * Formats an ISO date string to a human readable format
 * @param {string|Date} dateStr
 * @returns {string} e.g. "Sep 1, 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats full datetime
 * @param {string|Date} dateStr
 * @returns {string} e.g. "Sep 1, 2026, 04:30 PM"
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Validates reference number format (e.g. AGR-2026-X0MTKL6A or non-empty string)
 * @param {string} ref
 * @returns {boolean}
 */
export function isValidReferenceFormat(ref) {
  if (!ref || typeof ref !== 'string') return false;
  return ref.trim().length >= 5;
}
