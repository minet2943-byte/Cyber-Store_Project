import api from "./api";

/**
 * Endpoint for Cart operations in Spring Boot API.
 * Base URL is configured in api.js (default: http://localhost:8080/api).
 * Full URL: http://localhost:8080/api/cart
 */
const CART_ENDPOINT = "/cart";

/**
 * Builds and validates the payload expected by Spring Boot CartRequest:
 * {
 *   "customerId": 1,
 *   "productId": 24,
 *   "quantity": 2,
 *   "cartValue": 1599.98
 * }
 *
 * @param {Object} data
 * @param {number|string} data.customerId - ID of the customer
 * @param {number|string} data.productId - ID of the product
 * @param {number|string} [data.quantity=1] - Quantity of items (minimum 1)
 * @param {number|string} [data.cartValue] - Total value for this cart line
 * @param {number|string} [data.price] - Unit price fallback to calculate cartValue
 * @returns {Object} JSON payload conforming to CartRequest
 */
export const buildCartPayload = ({
  customerId,
  productId,
  quantity = 1,
  cartValue,
  price = 0,
}) => {
  const parsedCustomerId = Number(customerId);
  const parsedProductId = Number(productId);
  const parsedQuantity = Math.max(1, parseInt(quantity, 10) || 1);

  let parsedCartValue = Number(cartValue);
  if (isNaN(parsedCartValue) || parsedCartValue <= 0) {
    parsedCartValue = Number((Number(price) * parsedQuantity).toFixed(2));
  }

  return {
    customerId: parsedCustomerId,
    productId: parsedProductId,
    quantity: parsedQuantity,
    cartValue: Number(parsedCartValue.toFixed(2)),
  };
};

/**
 * Normalizes a single Cart item returned by Spring Boot CartResponse:
 * {
 *   "cartId": 3,
 *   "customerId": 3,
 *   "customerName": null,
 *   "productId": 16,
 *   "productName": "MAC M3",
 *   "quantity": 7,
 *   "cartValue": 49.98
 * }
 *
 * @param {Object} item - Raw backend cart item
 * @returns {Object|null} Normalized cart item
 */
export const normalizeCartItem = (item) => {
  if (!item || typeof item !== "object") return null;

  const cartId =
    item.cartId ??
    item.cart_id ??
    item.id ??
    null;

  const customerId =
    item.customerId ??
    item.customer_id ??
    item.customer?.id ??
    null;

  const customerName =
    item.customerName ??
    item.customer_name ??
    item.customer?.name ??
    null;

  const productId =
    item.productId ??
    item.product_id ??
    item.product?.id ??
    null;

  const productName =
    item.productName ??
    item.product_name ??
    item.product?.name ??
    (productId ? `Product #${productId}` : "Product");

  const quantity = Math.max(
    1,
    parseInt(item.quantity ?? item.qty ?? 1, 10) || 1,
  );

  const rawCartValue = Number(
    item.cartValue ??
      item.cart_value ??
      item.totalPrice ??
      item.total ??
      0,
  );

  const cartValue = Number(rawCartValue.toFixed(2));

  // Compute unit price from cartValue / quantity if available
  const unitPrice =
    quantity > 0 && cartValue > 0
      ? Number((cartValue / quantity).toFixed(2))
      : Number(item.product?.price ?? item.price ?? 0);

  const product = {
    id: productId,
    name: productName,
    price: unitPrice,
    imageUrl:
      item.imageUrl ??
      item.productImageUrl ??
      item.product?.imageUrl ??
      "",
    ...(typeof item.product === "object" ? item.product : {}),
  };

  return {
    cartId,
    id: cartId,
    key: cartId ? `cart-${cartId}` : `${productId}::std`,
    customerId,
    customerName,
    productId,
    productName,
    quantity,
    qty: quantity,
    cartValue,
    unitPrice,
    price: unitPrice,
    product,
    variant: item.variant ?? null,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
};

/**
 * Normalizes an array of Cart items.
 *
 * @param {Array|Object} items
 * @returns {Array} List of normalized cart items
 */
export const normalizeCartItems = (items = []) => {
  if (!items) return [];

  const list = Array.isArray(items)
    ? items
    : Array.isArray(items?.data)
      ? items.data
      : Array.isArray(items?.content)
        ? items.content
        : [items];

  return list.map(normalizeCartItem).filter(Boolean);
};

/**
 * Fetch all cart items from Spring Boot.
 * GET /api/cart
 *
 * @param {Object} [params] - Optional query parameters
 * @returns {Promise<Array>} Normalized cart items
 */
export const getCartItems = async (params = {}) => {
  const response = await api.get(CART_ENDPOINT, { params });
  const payload = response?.data;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.content)
        ? payload.content
        : [];

  return normalizeCartItems(items);
};

// Aliases for getCartItems
export const getCart = getCartItems;
export const getAllCarts = getCartItems;

/**
 * Fetch cart items for a specific customer.
 * Queries GET /api/cart and filters by customerId.
 *
 * @param {number|string} customerId
 * @returns {Promise<Array>} Filtered cart items
 */
export const getCartByCustomerId = async (customerId) => {
  if (!customerId) return [];

  try {
    const allItems = await getCartItems({ customerId });
    return allItems.filter(
      (item) => String(item.customerId) === String(customerId),
    );
  } catch (error) {
    console.warn(`Failed to fetch cart for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Fetch a single cart entry by cartId.
 * GET /api/cart/{id}
 *
 * @param {number|string} cartId
 * @returns {Promise<Object|null>} Normalized cart item
 */
export const getCartItemById = async (cartId) => {
  const response = await api.get(`${CART_ENDPOINT}/${cartId}`);
  const payload = response?.data?.data ?? response?.data;
  return payload ? normalizeCartItem(payload) : null;
};

/**
 * Add a new item to cart.
 * POST /api/cart
 * Payload:
 * {
 *   "customerId": 1,
 *   "productId": 24,
 *   "quantity": 2,
 *   "cartValue": 1599.98
 * }
 *
 * @param {Object} cartData
 * @returns {Promise<Object>} Created and normalized cart item
 */
export const addToCart = async (cartData) => {
  const payload = buildCartPayload(cartData);
  const response = await api.post(CART_ENDPOINT, payload);
  const data = response?.data?.data ?? response?.data;
  return normalizeCartItem(data);
};

export const createCartItem = addToCart;

/**
 * Update an existing cart item.
 * PUT /api/cart/{id}
 *
 * @param {number|string} cartId
 * @param {Object} cartData
 * @returns {Promise<Object>} Updated and normalized cart item
 */
export const updateCartItem = async (cartId, cartData) => {
  const id = cartId ?? cartData.cartId ?? cartData.id;
  const payload = buildCartPayload(cartData);
  const response = await api.put(`${CART_ENDPOINT}/${id}`, payload);
  const data = response?.data?.data ?? response?.data;
  return normalizeCartItem(data);
};

/**
 * Delete an item from cart by cartId.
 * DELETE /api/cart/{id}
 *
 * @param {number|string} cartId
 * @returns {Promise<any>}
 */
export const deleteCartItem = async (cartId) => {
  const response = await api.delete(`${CART_ENDPOINT}/${cartId}`);
  return response?.data;
};

export const removeCartItem = deleteCartItem;

/**
 * Clear all cart items belonging to a customer.
 *
 * @param {number|string} customerId
 * @returns {Promise<number>} Number of deleted items
 */
export const clearCartByCustomerId = async (customerId) => {
  if (!customerId) return 0;

  try {
    const customerItems = await getCartByCustomerId(customerId);
    const deletePromises = customerItems
      .filter((item) => item.cartId)
      .map((item) => deleteCartItem(item.cartId).catch(() => null));

    await Promise.allSettled(deletePromises);
    return customerItems.length;
  } catch (error) {
    console.warn(`Could not clear cart for customer ${customerId}:`, error);
    return 0;
  }
};

const cartApi = {
  getCartItems,
  getCart,
  getAllCarts,
  getCartByCustomerId,
  getCartItemById,
  addToCart,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  removeCartItem,
  clearCartByCustomerId,
  normalizeCartItem,
  normalizeCartItems,
  buildCartPayload,
};

export default cartApi;
