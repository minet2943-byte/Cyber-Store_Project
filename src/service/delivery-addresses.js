import api from "./api";

/**
 * Endpoint for Delivery Address operations in Spring Boot API.
 * Base URL is configured in api.js (default: http://localhost:8080/api).
 * Full URL: http://localhost:8080/api/delivery-addresses
 */
const DELIVERY_ADDRESS_ENDPOINT = "/delivery-addresses";

/**
 * Builds the payload expected by Spring Boot DeliveryAddressRequest:
 * {
 *   "customerId": 1,
 *   "recipientName": "fiineth",
 *   "phoneNumber": "+855 12 345 678",
 *   "streetAddress": "Street 271, Sangkat Boeung Keng Kang",
 *   "city": "Phnom Penh",
 *   "postalCode": "12000"
 * }
 *
 * @param {Object} data
 * @returns {Object} JSON payload conforming to DeliveryAddressRequest
 */
export const buildDeliveryAddressPayload = (data = {}) => {
  const customerId = Number(
    data.customerId ?? data.customer_id ?? data.customer?.id ?? 0,
  );
  const recipientName = String(
    data.recipientName ?? data.fullName ?? data.name ?? "",
  ).trim();
  const phoneNumber = String(
    data.phoneNumber ?? data.phone ?? data.customerTelephone ?? "",
  ).trim();
  const streetAddress = String(
    data.streetAddress ?? data.address ?? data.addressLine1 ?? "",
  ).trim();
  const city = String(data.city ?? "").trim();
  const postalCode = String(
    data.postalCode ?? data.zipCode ?? data.zip ?? "",
  ).trim();

  return {
    customerId,
    recipientName,
    phoneNumber,
    streetAddress,
    city,
    postalCode,
  };
};

/**
 * Normalizes a single delivery address item from Spring Boot DeliveryAddressResponse:
 * {
 *   "addressId": 1,
 *   "customerId": 1,
 *   "recipientName": "fiineth",
 *   "phoneNumber": "+855 12 345 678",
 *   "streetAddress": "Street 271",
 *   "city": "Phnom Penh",
 *   "postalCode": "12000",
 *   "createdAt": "...",
 *   "updatedAt": "..."
 * }
 *
 * @param {Object} item - Raw backend delivery address
 * @returns {Object|null} Normalized delivery address object
 */
export const normalizeDeliveryAddress = (item) => {
  if (!item || typeof item !== "object") return null;

  const addressId = item.addressId ?? item.id ?? item.address_id ?? null;
  const customerId = item.customerId ?? item.customer_id ?? null;
  const recipientName = item.recipientName ?? item.name ?? "";
  const phoneNumber = item.phoneNumber ?? item.phone ?? "";
  const streetAddress = item.streetAddress ?? item.address ?? "";
  const city = item.city ?? "";
  const postalCode = item.postalCode ?? item.zipCode ?? "";

  const fullAddress = [streetAddress, city, postalCode]
    .filter(Boolean)
    .join(", ");

  return {
    ...item,
    id: addressId,
    addressId,
    customerId,
    recipientName,
    fullName: recipientName,
    phoneNumber,
    phone: phoneNumber,
    streetAddress,
    address: streetAddress,
    city,
    postalCode,
    zipCode: postalCode,
    fullAddress,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
};

/**
 * Normalizes an array of delivery address items.
 *
 * @param {Array|Object} items
 * @returns {Array} List of normalized delivery addresses
 */
export const normalizeDeliveryAddresses = (items = []) => {
  if (!items) return [];

  const list = Array.isArray(items)
    ? items
    : Array.isArray(items?.data)
      ? items.data
      : Array.isArray(items?.content)
        ? items.content
        : [items];

  return list.map(normalizeDeliveryAddress).filter(Boolean);
};

/**
 * Fetch all delivery addresses from Spring Boot API.
 * GET /api/delivery-addresses
 *
 * @param {Object} [params] - Optional query parameters
 * @returns {Promise<Array>} List of delivery addresses
 */
export const getDeliveryAddresses = async (params = {}) => {
  const response = await api.get(DELIVERY_ADDRESS_ENDPOINT, { params });
  const payload = response?.data;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.content)
        ? payload.content
        : [];

  return normalizeDeliveryAddresses(items);
};

/**
 * Fetch delivery addresses for a specific customer.
 * GET /api/delivery-addresses/customer/{customerId}
 *
 * @param {number|string} customerId
 * @returns {Promise<Array>} List of customer delivery addresses
 */
export const getAddressesByCustomerId = async (customerId) => {
  if (!customerId) return [];
  const response = await api.get(
    `${DELIVERY_ADDRESS_ENDPOINT}/customer/${customerId}`,
  );
  const payload = response?.data;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  return normalizeDeliveryAddresses(items);
};

/**
 * Fetch a single delivery address by ID.
 * GET /api/delivery-addresses/{id}
 *
 * @param {number|string} id - Address ID
 * @returns {Promise<Object|null>} Normalized delivery address
 */
export const getDeliveryAddressById = async (id) => {
  const response = await api.get(`${DELIVERY_ADDRESS_ENDPOINT}/${id}`);
  const payload = response?.data?.data ?? response?.data;
  return payload ? normalizeDeliveryAddress(payload) : null;
};

/**
 * Create a new delivery address.
 * POST /api/delivery-addresses
 *
 * @param {Object} addressData
 * @returns {Promise<Object>} Created and normalized delivery address
 */
export const createDeliveryAddress = async (addressData) => {
  const payload = buildDeliveryAddressPayload(addressData);
  const response = await api.post(DELIVERY_ADDRESS_ENDPOINT, payload);
  const data = response?.data?.data ?? response?.data;
  return normalizeDeliveryAddress(data);
};

/**
 * Update an existing delivery address.
 * PUT /api/delivery-addresses/{id}
 *
 * @param {number|string} id - Address ID
 * @param {Object} addressData
 * @returns {Promise<Object>} Updated and normalized delivery address
 */
export const updateDeliveryAddress = async (id, addressData) => {
  const addressId = id ?? addressData.addressId ?? addressData.id;
  const payload = buildDeliveryAddressPayload(addressData);
  const response = await api.put(
    `${DELIVERY_ADDRESS_ENDPOINT}/${addressId}`,
    payload,
  );
  const data = response?.data?.data ?? response?.data;
  return normalizeDeliveryAddress(data);
};

/**
 * Delete a delivery address by ID.
 * DELETE /api/delivery-addresses/{id}
 *
 * @param {number|string} id - Address ID
 * @returns {Promise<any>}
 */
export const deleteDeliveryAddress = async (id) => {
  const response = await api.delete(`${DELIVERY_ADDRESS_ENDPOINT}/${id}`);
  return response?.data;
};

const deliveryAddressApi = {
  getDeliveryAddresses,
  getAddressesByCustomerId,
  getDeliveryAddressById,
  createDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  normalizeDeliveryAddress,
  normalizeDeliveryAddresses,
  buildDeliveryAddressPayload,
};

export default deliveryAddressApi;
