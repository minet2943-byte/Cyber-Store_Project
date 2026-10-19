import api from "./api";

/**
 * Endpoint for Dashboard operations in Spring Boot API.
 * Base URL is configured in api.js (default: http://localhost:8080/api).
 * Full URL: http://localhost:8080/api/dashboard/summary
 */
const DASHBOARD_ENDPOINT = "/dashboard/summary";

/**
 * Format currency numbers into user-friendly strings ($1,234.56 or $98.4K).
 */
export const formatRevenue = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format integer count with commas (e.g. 1,248).
 */
export const formatCount = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString("en-US");
};

/**
 * Fallback values when backend is offline or loading.
 */
export const DEFAULT_DASHBOARD_SUMMARY = {
  totalProducts: 0,
  totalCustomers: 0,
  totalOrders: 0,
  totalPayments: 0,
  totalRevenue: 0,
  formattedRevenue: "$0.00",
  formattedProducts: "0",
  formattedCustomers: "0",
  formattedOrders: "0",
  formattedPayments: "0",
};

/**
 * Normalizes backend DashboardResponse:
 * {
 *   "totalProducts": 142,
 *   "totalCustomers": 4712,
 *   "totalOrders": 1248,
 *   "totalPayments": 1240,
 *   "totalRevenue": 98400.50
 * }
 *
 * @param {Object} data - Raw backend dashboard response
 * @returns {Object} Normalized dashboard summary
 */
export const normalizeDashboardSummary = (data) => {
  if (!data || typeof data !== "object") return DEFAULT_DASHBOARD_SUMMARY;

  const totalProducts = Number(
    data.totalProducts ?? data.products ?? data.productsCount ?? 0,
  );
  const totalCustomers = Number(
    data.totalCustomers ?? data.customers ?? data.customersCount ?? 0,
  );
  const totalOrders = Number(
    data.totalOrders ?? data.orders ?? data.ordersCount ?? 0,
  );
  const totalPayments = Number(
    data.totalPayments ?? data.payments ?? data.paymentsCount ?? 0,
  );
  const totalRevenue = Number(
    data.totalRevenue ?? data.revenue ?? data.sales ?? 0,
  );

  return {
    ...data,
    totalProducts,
    totalCustomers,
    totalOrders,
    totalPayments,
    totalRevenue,
    formattedRevenue: formatRevenue(totalRevenue),
    formattedProducts: formatCount(totalProducts),
    formattedCustomers: formatCount(totalCustomers),
    formattedOrders: formatCount(totalOrders),
    formattedPayments: formatCount(totalPayments),
  };
};

/**
 * Fetch dashboard summary statistics from Spring Boot API.
 * GET /api/dashboard/summary
 *
 * @returns {Promise<Object>} Normalized dashboard summary
 */
export const getDashboardSummary = async () => {
  const response = await api.get(DASHBOARD_ENDPOINT);
  const payload = response?.data?.data ?? response?.data;
  return normalizeDashboardSummary(payload);
};

// Aliases
export const getSummary = getDashboardSummary;

const dashboardApi = {
  getDashboardSummary,
  getSummary,
  normalizeDashboardSummary,
  formatRevenue,
  formatCount,
  DEFAULT_DASHBOARD_SUMMARY,
};

export default dashboardApi;
