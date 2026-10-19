import api from "./api";

/**
 * Endpoint for Customer operations in Spring Boot API.
 * Base URL is configured in api.js (default: http://localhost:8080/api).
 * Full URL: http://localhost:8080/api/customer
 */
const CUSTOMER_ENDPOINT = "/customer";

/**
 * Builds the payload expected by Spring Boot CustomerRequest:
 * {
 *   "name": "fiineth",
 *   "email": "fiineth@gmail.com",
 *   "customerTelephone": "+855 12 345 678",
 *   "addressLine1": "Street 271, Sangkat Boeung Keng Kang",
 *   "addressLine2": "Building A, Floor 2",
 *   "city": "Phnom Penh",
 *   "postalCode": "12000",
 *   "state": "Phnom Penh",
 *   "country": "Cambodia"
 * }
 *
 * @param {Object} data
 * @returns {Object} JSON payload conforming to CustomerRequest
 */
export const buildCustomerPayload = (data = {}) => {
  const name = String(data.name ?? data.customerName ?? "").trim();
  const email = String(data.email ?? data.customerEmail ?? "").trim();
  const customerTelephone =
    data.customerTelephone ?? data.phone ?? data.telephone ?? null;
  const addressLine1 = data.addressLine1 ?? null;
  const addressLine2 = data.addressLine2 ?? null;
  const city = data.city ?? null;
  const postalCode = data.postalCode ?? null;
  const state = data.state ?? null;
  const country = data.country ?? null;

  return {
    name,
    email,
    customerTelephone,
    addressLine1,
    addressLine2,
    city,
    postalCode,
    state,
    country,
  };
};

/**
 * Normalizes a single Customer item returned by Spring Boot CustomerResponse:
 * {
 *   "customerId": 13,
 *   "customerName": "fiineth",
 *   "customerEmail": "fiineth@gmail.com",
 *   "customerTelephone": "+855 12 345 678",
 *   "addressLine1": "Street 271, Sangkat Boeung Keng Kang",
 *   "addressLine2": "Building A, Floor 2",
 *   "city": "Phnom Penh",
 *   "postalCode": "12000",
 *   "state": "Phnom Penh",
 *   "country": "Cambodia",
 *   "cartId": 4,
 *   "orderIds": [],
 *   "paymentIds": [],
 *   "deliveryIds": []
 * }
 *
 * @param {Object} customer - Raw backend customer object
 * @returns {Object|null} Normalized customer object
 */
export const normalizeCustomer = (customer) => {
  if (!customer || typeof customer !== "object") return null;

  const customerId =
    customer.customerId ??
    customer.customer_id ??
    customer.id ??
    null;

  const name =
    customer.customerName ??
    customer.customer_name ??
    customer.name ??
    "";

  const email =
    customer.customerEmail ??
    customer.customer_email ??
    customer.email ??
    "";

  const phone =
    customer.customerTelephone ??
    customer.customer_telephone ??
    customer.telephone ??
    customer.phone ??
    "";

  const addressLine1 =
    customer.addressLine1 ?? customer.address_line_1 ?? customer.address ?? "";
  const addressLine2 =
    customer.addressLine2 ?? customer.address_line_2 ?? "";
  const city = customer.city ?? "";
  const postalCode = customer.postalCode ?? customer.postal_code ?? "";
  const state = customer.state ?? "";
  const country = customer.country ?? "";

  const fullAddress = [
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
  ]
    .filter(Boolean)
    .join(", ");

  const orderIds = Array.isArray(customer.orderIds)
    ? customer.orderIds
    : Array.isArray(customer.order_ids)
      ? customer.order_ids
      : [];

  const paymentIds = Array.isArray(customer.paymentIds)
    ? customer.paymentIds
    : Array.isArray(customer.payment_ids)
      ? customer.payment_ids
      : [];

  const deliveryIds = Array.isArray(customer.deliveryIds)
    ? customer.deliveryIds
    : Array.isArray(customer.delivery_ids)
      ? customer.delivery_ids
      : [];

  const ordersCount =
    typeof customer.orders === "number"
      ? customer.orders
      : orderIds.length;

  return {
    ...customer,
    id: customerId,
    customerId,
    name,
    customerName: name,
    email,
    customerEmail: email,
    phone,
    customerTelephone: phone,
    addressLine1,
    addressLine2,
    city,
    postalCode,
    state,
    country,
    fullAddress,
    cartId: customer.cartId ?? customer.cart_id ?? null,
    orderIds,
    orders: ordersCount,
    ordersCount,
    paymentIds,
    deliveryIds,
  };
};

/**
 * Normalizes an array of Customer items.
 *
 * @param {Array|Object} items
 * @returns {Array} List of normalized customers
 */
export const normalizeCustomers = (items = []) => {
  if (!items) return [];

  const list = Array.isArray(items)
    ? items
    : Array.isArray(items?.data)
      ? items.data
      : Array.isArray(items?.content)
        ? items.content
        : [items];

  return list.map(normalizeCustomer).filter(Boolean);
};

/**
 * Fetch all customers from Spring Boot.
 * GET /api/customer
 *
 * @param {Object} [params] - Optional query parameters
 * @returns {Promise<Array>} List of normalized customers
 */
export const getCustomers = async (params = {}) => {
  const response = await api.get(CUSTOMER_ENDPOINT, { params });
  const payload = response?.data;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.content)
        ? payload.content
        : [];

  return normalizeCustomers(items);
};

// Aliases
export const getAllCustomers = getCustomers;

/**
 * Fetch a single customer by customerId.
 * GET /api/customer/{id}
 *
 * @param {number|string} id - Customer ID
 * @returns {Promise<Object|null>} Normalized customer
 */
export const getCustomerById = async (id) => {
  const response = await api.get(`${CUSTOMER_ENDPOINT}/${id}`);
  const payload = response?.data?.data ?? response?.data;
  return payload ? normalizeCustomer(payload) : null;
};

/**
 * Find customer by email address.
 *
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
export const getCustomerByEmail = async (email) => {
  if (!email) return null;
  const allCustomers = await getCustomers();
  return (
    allCustomers.find(
      (c) => c.email?.toLowerCase() === String(email).toLowerCase(),
    ) ?? null
  );
};

/**
 * Create a new customer.
 * POST /api/customer
 *
 * @param {Object} customerData
 * @returns {Promise<Object>} Created customer
 */
export const createCustomer = async (customerData) => {
  const payload = buildCustomerPayload(customerData);
  const response = await api.post(CUSTOMER_ENDPOINT, payload);
  const data = response?.data?.data ?? response?.data;
  return normalizeCustomer(data);
};

/**
 * Update an existing customer.
 * PUT /api/customer/{id}
 *
 * @param {number|string} id - Customer ID
 * @param {Object} customerData - Customer updates
 * @returns {Promise<Object>} Updated customer
 */
export const updateCustomer = async (id, customerData) => {
  const customerId = id ?? customerData.customerId ?? customerData.id;
  const payload = buildCustomerPayload(customerData);
  const response = await api.put(`${CUSTOMER_ENDPOINT}/${customerId}`, payload);
  const data = response?.data?.data ?? response?.data;
  return normalizeCustomer(data);
};

/**
 * Delete a customer by customerId.
 * DELETE /api/customer/{id}
 *
 * @param {number|string} id - Customer ID
 * @returns {Promise<any>}
 */
export const deleteCustomer = async (id) => {
  const response = await api.delete(`${CUSTOMER_ENDPOINT}/${id}`);
  return response?.data;
};

/**
 * Fetch delivery addresses associated with a customer.
 * GET /api/delivery-addresses/customer/{customerId}
 *
 * @param {number|string} customerId
 * @returns {Promise<Array>} List of delivery addresses
 */
export const getCustomerDeliveryAddresses = async (customerId) => {
  try {
    const response = await api.get(
      `/delivery-addresses/customer/${customerId}`,
    );
    const payload = response?.data?.data ?? response?.data;
    return Array.isArray(payload) ? payload : [];
  } catch (error) {
    console.warn(
      `Could not load delivery addresses for customer ${customerId}:`,
      error,
    );
    return [];
  }
};

const customerApi = {
  getCustomers,
  getAllCustomers,
  getCustomerById,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerDeliveryAddresses,
  normalizeCustomer,
  normalizeCustomers,
  buildCustomerPayload,
};

export default customerApi;
