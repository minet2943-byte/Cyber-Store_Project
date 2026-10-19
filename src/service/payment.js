import api from "./api";

/**
 * Endpoint for Payment operations in Spring Boot API.
 * Base URL is configured in api.js (default: http://localhost:8080/api).
 * Full URL: http://localhost:8080/api/payment
 */
const PAYMENT_ENDPOINT = "/payment";

/**
 * Supported payment types matching Spring Boot enum:
 * ["CASH", "CREDIT_CARD", "ABA", "ACLEDA", "PAYPAL"]
 */
export const PAYMENT_TYPES = {
  CASH: "CASH",
  CREDIT_CARD: "CREDIT_CARD",
  ABA: "ABA",
  ACLEDA: "ACLEDA",
  PAYPAL: "PAYPAL",
};

/**
 * Normalizes input payment method string or ID into a valid backend enum.
 * E.g. "qr" -> "ABA", "card" -> "CREDIT_CARD", "cod" -> "CASH"
 *
 * @param {string} type - Raw payment type string
 * @returns {string} One of ["CASH", "CREDIT_CARD", "ABA", "ACLEDA", "PAYPAL"]
 */
export const normalizePaymentType = (type = "") => {
  if (!type) return PAYMENT_TYPES.CASH;

  const raw = String(type).toUpperCase().trim();

  if (raw === "CASH" || raw.includes("COD") || raw.includes("DELIVERY")) {
    return PAYMENT_TYPES.CASH;
  }
  if (
    raw === "CREDIT_CARD" ||
    raw.includes("CARD") ||
    raw.includes("VISA") ||
    raw.includes("MASTER")
  ) {
    return PAYMENT_TYPES.CREDIT_CARD;
  }
  if (
    raw === "ABA" ||
    raw.includes("QR") ||
    raw.includes("KHQR") ||
    raw.includes("SCAN") ||
    raw.includes("PROMPTPAY")
  ) {
    return PAYMENT_TYPES.ABA;
  }
  if (raw === "ACLEDA") {
    return PAYMENT_TYPES.ACLEDA;
  }
  if (raw === "PAYPAL") {
    return PAYMENT_TYPES.PAYPAL;
  }

  // Fallback to recognized enums or CASH
  return PAYMENT_TYPES[raw] || PAYMENT_TYPES.CASH;
};

/**
 * Formats a payment enum into a human-readable label.
 */
export const formatPaymentTypeLabel = (type = "") => {
  const normalized = normalizePaymentType(type);
  switch (normalized) {
    case PAYMENT_TYPES.CASH:
      return "Cash on Delivery (COD)";
    case PAYMENT_TYPES.CREDIT_CARD:
      return "Credit / Debit Card";
    case PAYMENT_TYPES.ABA:
      return "ABA Bank / KHQR Scan";
    case PAYMENT_TYPES.ACLEDA:
      return "ACLEDA Bank";
    case PAYMENT_TYPES.PAYPAL:
      return "PayPal";
    default:
      return normalized;
  }
};

/**
 * Builds the payload expected by Spring Boot PaymentRequest:
 * {
 *   "customerId": 1,
 *   "orderId": 1,
 *   "paymentType": "CASH"
 * }
 *
 * @param {Object} data
 * @param {number|string} data.customerId
 * @param {number|string} data.orderId
 * @param {string} [data.paymentType="CASH"]
 * @returns {Object} JSON payload conforming to PaymentRequest
 */
export const buildPaymentPayload = (data = {}) => {
  const customerId = Number(
    data.customerId ?? data.customer_id ?? data.customer?.id ?? 0,
  );
  const orderId = Number(
    data.orderId ?? data.order_id ?? data.order?.id ?? 0,
  );
  const paymentType = normalizePaymentType(
    data.paymentType ?? data.paymentMethod ?? data.type ?? "CASH",
  );

  return {
    customerId,
    orderId,
    paymentType,
  };
};

/**
 * Normalizes a single Payment response from Spring Boot PaymentResponse:
 * {
 *   "paymentId": 1,
 *   "customerId": 1,
 *   "customerName": null,
 *   "orderId": 1,
 *   "paymentType": "CASH"
 * }
 *
 * @param {Object} item - Raw backend payment item
 * @returns {Object|null} Normalized payment item
 */
export const normalizePayment = (item) => {
  if (!item || typeof item !== "object") return null;

  const paymentId = item.paymentId ?? item.payment_id ?? item.id ?? null;
  const customerId = item.customerId ?? item.customer_id ?? null;
  const customerName = item.customerName ?? item.customer_name ?? null;
  const orderId = item.orderId ?? item.order_id ?? null;
  const paymentType = normalizePaymentType(item.paymentType ?? item.type);
  const paymentTypeLabel = formatPaymentTypeLabel(paymentType);

  return {
    ...item,
    id: paymentId,
    paymentId,
    customerId,
    customerName,
    orderId,
    paymentType,
    paymentTypeLabel,
  };
};

/**
 * Normalizes an array of Payment responses.
 *
 * @param {Array|Object} items
 * @returns {Array} List of normalized payments
 */
export const normalizePayments = (items = []) => {
  if (!items) return [];

  const list = Array.isArray(items)
    ? items
    : Array.isArray(items?.data)
      ? items.data
      : Array.isArray(items?.content)
        ? items.content
        : [items];

  return list.map(normalizePayment).filter(Boolean);
};

/**
 * Fetch all payments from Spring Boot API.
 * GET /api/payment
 *
 * @param {Object} [params] - Optional query parameters
 * @returns {Promise<Array>} List of normalized payments
 */
export const getPayments = async (params = {}) => {
  const response = await api.get(PAYMENT_ENDPOINT, { params });
  const payload = response?.data;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.content)
        ? payload.content
        : [];

  return normalizePayments(items);
};

// Aliases
export const getAllPayments = getPayments;

/**
 * Fetch a single payment by paymentId.
 * GET /api/payment/{id}
 *
 * @param {number|string} id - Payment ID
 * @returns {Promise<Object|null>} Normalized payment
 */
export const getPaymentById = async (id) => {
  const response = await api.get(`${PAYMENT_ENDPOINT}/${id}`);
  const payload = response?.data?.data ?? response?.data;
  return payload ? normalizePayment(payload) : null;
};

/**
 * Fetch payments for a specific customer.
 *
 * @param {number|string} customerId
 * @returns {Promise<Array>} Filtered payments
 */
export const getPaymentsByCustomerId = async (customerId) => {
  if (!customerId) return [];
  try {
    const all = await getPayments({ customerId });
    return all.filter((p) => String(p.customerId) === String(customerId));
  } catch (error) {
    console.warn(`Failed to fetch payments for customer ${customerId}:`, error);
    return [];
  }
};

/**
 * Fetch payments for a specific order.
 *
 * @param {number|string} orderId
 * @returns {Promise<Array>} Filtered payments
 */
export const getPaymentsByOrderId = async (orderId) => {
  if (!orderId) return [];
  try {
    const all = await getPayments({ orderId });
    return all.filter((p) => String(p.orderId) === String(orderId));
  } catch (error) {
    console.warn(`Failed to fetch payments for order ${orderId}:`, error);
    return [];
  }
};

/**
 * Create a new payment record.
 * POST /api/payment
 *
 * @param {Object} paymentData
 * @returns {Promise<Object>} Created and normalized payment
 */
export const createPayment = async (paymentData) => {
  const payload = buildPaymentPayload(paymentData);
  // Send body and params for complete compatibility with Spring controller
  const response = await api.post(PAYMENT_ENDPOINT, payload, {
    params: payload,
  });
  const data = response?.data?.data ?? response?.data;
  return normalizePayment(data);
};

export const processPayment = createPayment;

/**
 * Update an existing payment.
 * PUT /api/payment/{id}
 *
 * @param {number|string} id - Payment ID
 * @param {Object} paymentData - Payment updates
 * @returns {Promise<Object>} Updated and normalized payment
 */
export const updatePayment = async (id, paymentData) => {
  const paymentId = id ?? paymentData.paymentId ?? paymentData.id;
  const payload = buildPaymentPayload(paymentData);
  const response = await api.put(`${PAYMENT_ENDPOINT}/${paymentId}`, payload, {
    params: payload,
  });
  const data = response?.data?.data ?? response?.data;
  return normalizePayment(data);
};

/**
 * Delete a payment record by id.
 * DELETE /api/payment/{id}
 *
 * @param {number|string} id - Payment ID
 * @returns {Promise<any>}
 */
export const deletePayment = async (id) => {
  const response = await api.delete(`${PAYMENT_ENDPOINT}/${id}`);
  return response?.data;
};

const paymentApi = {
  getPayments,
  getAllPayments,
  getPaymentById,
  getPaymentsByCustomerId,
  getPaymentsByOrderId,
  createPayment,
  processPayment,
  updatePayment,
  deletePayment,
  normalizePayment,
  normalizePayments,
  buildPaymentPayload,
  normalizePaymentType,
  formatPaymentTypeLabel,
  PAYMENT_TYPES,
};

export default paymentApi;
