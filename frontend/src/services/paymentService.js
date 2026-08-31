import apiClient from '../api/client';

/**
 * Normalizes user input reference (converts spaces/underscores to hyphens and uppercases)
 */
export function normalizeReference(ref) {
  if (!ref) return '';
  return ref
    .trim()
    .toUpperCase()
    .replace(/[\s_]+/g, '-');
}

/**
 * Inquire rental agreement payment information by reference number from real PostgreSQL database.
 * Corresponds to: GET /api/payments/inquiry/:referenceNumber
 * 
 * @param {string} referenceNumber
 * @returns {Promise<{success: boolean, data: object}>}
 */
export async function inquireRentalAgreement(referenceNumber) {
  const cleanRef = normalizeReference(referenceNumber);
  
  if (!cleanRef) {
    throw new Error('Please enter a valid rental reference number.');
  }

  try {
    const response = await apiClient.get(`/api/payments/inquiry/${encodeURIComponent(cleanRef)}`);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    throw new Error(response.data?.error || 'Unable to retrieve agreement information from the registry.');
  } catch (error) {
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.message || 
                     (error.response?.status === 404 ? 'Rental agreement reference not found in the official registry. Please check the reference code and try again.' : error.message);
    throw new Error(errorMsg);
  }
}

/**
 * Initiate rental payment through SmartRent provider integration.
 * Corresponds to: POST /api/payments
 * 
 * @param {object} payload
 * @param {string} payload.referenceNumber
 * @param {number} payload.amount
 * @param {'TELEBIRR'|'CBE'} payload.paymentMethod
 * @param {string} payload.customerName
 * @param {string} payload.customerPhoneNumber
 * @returns {Promise<{success: boolean, data: object}>}
 */
export async function initiatePayment(payload) {
  const cleanRef = normalizeReference(payload.referenceNumber);

  try {
    const response = await apiClient.post('/api/payments', {
      referenceNumber: cleanRef,
      amount: Number(payload.amount),
      paymentMethod: payload.paymentMethod,
      customerName: payload.customerName,
      customerPhoneNumber: payload.customerPhoneNumber,
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    throw new Error(response.data?.error || 'Payment initiation rejected by server.');
  } catch (error) {
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.message || 
                     error.message || 
                     'Payment initiation failed. Please try again.';
    throw new Error(errorMsg);
  }
}

/**
 * Get payment status and details by paymentId from real database
 * Corresponds to: GET /api/payments/:paymentId
 * 
 * @param {string} paymentId
 * @returns {Promise<{success: boolean, data: object}>}
 */
export async function getPaymentStatus(paymentId) {
  if (!paymentId) {
    throw new Error('paymentId is required to fetch payment status');
  }

  try {
    const response = await apiClient.get(`/api/payments/${encodeURIComponent(paymentId)}`);
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }
    throw new Error(response.data?.error || 'Payment record not found.');
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    throw new Error(errorMsg);
  }
}
