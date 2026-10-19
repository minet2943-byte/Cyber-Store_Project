import api from "./api";

/**
 * Endpoint for Contact Channels in Spring Boot API.
 * Base URL is configured in api.js (default: http://localhost:8080/api).
 * Full URL: http://localhost:8080/api/contact-channels
 */
const CONTACT_ENDPOINT = "/contact-channels";

/**
 * Mapping of platformIcon string from backend to normalized icon keys for UI.
 */
export const normalizeIconType = (platformIcon = "") => {
  const lower = String(platformIcon).toLowerCase().trim();
  if (lower.includes("facebook") || lower.includes("fb")) return "facebook";
  if (lower.includes("telegram") || lower.includes("tg")) return "telegram";
  if (lower.includes("whatsapp")) return "whatsapp";
  if (lower.includes("discord")) return "discord";
  if (lower.includes("headphone") || lower.includes("support")) return "headphones";
  if (lower.includes("mail") || lower.includes("email")) return "mail";
  if (lower.includes("phone") || lower.includes("call") || lower.includes("voice")) return "phone";
  if (lower.includes("map") || lower.includes("pin") || lower.includes("location")) return "map-pin";
  return lower || "globe";
};

/**
 * Mapping of badge color themes to Tailwind classes.
 */
export const BADGE_THEME_MAP = {
  "Blue / Facebook": "text-blue-400 border-blue-500/30 bg-blue-500/10",
  "Cyan / Telegram": "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  "Green / Online": "text-ok border-ok/30 bg-ok/10",
  "Purple / Accent": "text-violet-soft border-violet/30 bg-violet/10",
  "Teal / Tech": "text-teal-soft border-teal/30 bg-teal/10",
  "Amber / Urgent": "text-warn border-warn/30 bg-warn/10",
  "Neutral Surface": "text-gray-400 border-border bg-surface",
};

/**
 * Resolves badge color classes from theme name or raw classes.
 */
export const resolveBadgeColor = (themeOrClass = "") => {
  if (!themeOrClass) return "text-blue-400 border-blue-500/30 bg-blue-500/10";
  if (BADGE_THEME_MAP[themeOrClass]) {
    return BADGE_THEME_MAP[themeOrClass];
  }
  return themeOrClass;
};

/**
 * Builds the payload expected by Spring Boot ContactChannelRequest:
 * {
 *   "actionButtonText": "Connect Now",
 *   "activeAndVisible": true,
 *   "badgeColorTheme": "Blue / Facebook",
 *   "badgeText": "Official",
 *   "channelTitle": "Facebook Page (Owner)",
 *   "description": "Official Facebook channel for customer support.",
 *   "displayHandleText": "facebook.com/owner",
 *   "openInNewTab": true,
 *   "platformIcon": "Facebook (Owner)",
 *   "targetLinkUrl": "https://facebook.com/owner"
 * }
 *
 * @param {Object} data
 * @returns {Object} JSON payload conforming to ContactChannelRequest
 */
export const buildContactPayload = (data = {}) => {
  const channelTitle = String(
    data.channelTitle ?? data.title ?? "",
  ).trim();

  const platformIcon = String(
    data.platformIcon ?? data.iconType ?? "Facebook (Owner)",
  ).trim();

  const displayHandleText = String(
    data.displayHandleText ?? data.contactValue ?? "",
  ).trim();

  const targetLinkUrl = String(
    data.targetLinkUrl ?? data.linkUrl ?? "",
  ).trim();

  const description = String(data.description ?? "").trim();
  const badgeText = String(data.badgeText ?? data.badge ?? "Official").trim();

  const badgeColorTheme =
    data.badgeColorTheme ??
    data.badgeColor ??
    "Blue / Facebook";

  const actionButtonText = String(
    data.actionButtonText ?? data.actionText ?? "Connect Now",
  ).trim();

  const openInNewTab =
    data.openInNewTab !== undefined
      ? Boolean(data.openInNewTab)
      : data.isExternal !== undefined
        ? Boolean(data.isExternal)
        : true;

  const activeAndVisible =
    data.activeAndVisible !== undefined
      ? Boolean(data.activeAndVisible)
      : data.enabled !== undefined
        ? Boolean(data.enabled)
        : true;

  return {
    channelTitle,
    platformIcon,
    displayHandleText,
    targetLinkUrl,
    description,
    badgeText,
    badgeColorTheme,
    actionButtonText,
    openInNewTab,
    activeAndVisible,
  };
};

/**
 * Normalizes a single contact channel item from Spring Boot ContactChannelResponse:
 * {
 *   "id": 6,
 *   "channelTitle": "Facebook Page (Owner)",
 *   "platformIcon": "Facebook (Owner)",
 *   "description": "Official Facebook channel for customer support.",
 *   "displayHandleText": "facebook.com/owner",
 *   "targetLinkUrl": "https://facebook.com/owner",
 *   "badgeText": "Official",
 *   "badgeColorTheme": "Blue / Facebook",
 *   "actionButtonText": "Connect Now",
 *   "openInNewTab": true,
 *   "activeAndVisible": true
 * }
 *
 * @param {Object} item - Raw backend contact channel
 * @returns {Object|null} Normalized contact channel object compatible with frontend
 */
export const normalizeContact = (item) => {
  if (!item || typeof item !== "object") return null;

  const id = item.id ?? item.channelId ?? item._id ?? null;
  const channelTitle = item.channelTitle ?? item.title ?? "";
  const platformIcon = item.platformIcon ?? item.iconType ?? "Facebook (Owner)";
  const iconType = normalizeIconType(platformIcon);
  const description = item.description ?? "";
  const displayHandleText = item.displayHandleText ?? item.contactValue ?? "";
  const targetLinkUrl = item.targetLinkUrl ?? item.linkUrl ?? "";
  const badgeText = item.badgeText ?? item.badge ?? "Official";
  const badgeColorTheme = item.badgeColorTheme ?? "Blue / Facebook";
  const badgeColor = resolveBadgeColor(badgeColorTheme || item.badgeColor);
  const actionButtonText = item.actionButtonText ?? item.actionText ?? "Connect Now";
  const openInNewTab = Boolean(
    item.openInNewTab !== undefined ? item.openInNewTab : item.isExternal ?? true,
  );
  const activeAndVisible = Boolean(
    item.activeAndVisible !== undefined ? item.activeAndVisible : item.enabled ?? true,
  );

  return {
    ...item,
    id,
    // Backend field names
    channelTitle,
    platformIcon,
    displayHandleText,
    targetLinkUrl,
    badgeText,
    badgeColorTheme,
    actionButtonText,
    openInNewTab,
    activeAndVisible,
    // Frontend compatibility field aliases
    title: channelTitle,
    iconType,
    contactValue: displayHandleText,
    linkUrl: targetLinkUrl,
    badge: badgeText,
    badgeColor,
    actionText: actionButtonText,
    isExternal: openInNewTab,
    enabled: activeAndVisible,
  };
};

/**
 * Normalizes an array of contact channel items.
 *
 * @param {Array|Object} items
 * @returns {Array} List of normalized contact channels
 */
export const normalizeContacts = (items = []) => {
  if (!items) return [];

  const list = Array.isArray(items)
    ? items
    : Array.isArray(items?.data)
      ? items.data
      : Array.isArray(items?.content)
        ? items.content
        : [items];

  return list.map(normalizeContact).filter(Boolean);
};

/**
 * Fetch all contact channels from Spring Boot.
 * GET /api/contact-channels
 *
 * @param {Object} [params] - Optional query parameters
 * @returns {Promise<Array>} List of normalized contact channels
 */
export const getContactChannels = async (params = {}) => {
  const response = await api.get(CONTACT_ENDPOINT, { params });
  const payload = response?.data;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.content)
        ? payload.content
        : [];

  return normalizeContacts(items);
};

// Aliases
export const getContacts = getContactChannels;
export const getAllContactChannels = getContactChannels;

/**
 * Fetch a single contact channel by id.
 * GET /api/contact-channels/{id}
 *
 * @param {number|string} id - Contact Channel ID
 * @returns {Promise<Object|null>} Normalized contact channel
 */
export const getContactChannelById = async (id) => {
  const response = await api.get(`${CONTACT_ENDPOINT}/${id}`);
  const payload = response?.data?.data ?? response?.data;
  return payload ? normalizeContact(payload) : null;
};

/**
 * Create a new contact channel.
 * POST /api/contact-channels
 *
 * @param {Object} channelData
 * @returns {Promise<Object>} Created and normalized contact channel
 */
export const createContactChannel = async (channelData) => {
  const payload = buildContactPayload(channelData);
  // Support both JSON body and query parameters as defined by Spring controller
  const response = await api.post(CONTACT_ENDPOINT, payload, {
    params: payload,
  });
  const data = response?.data?.data ?? response?.data;
  return normalizeContact(data);
};

export const createContact = createContactChannel;

/**
 * Update an existing contact channel.
 * PUT /api/contact-channels/{id}
 *
 * @param {number|string} id - Contact Channel ID
 * @param {Object} channelData - Channel updates
 * @returns {Promise<Object>} Updated and normalized contact channel
 */
export const updateContactChannel = async (id, channelData) => {
  const channelId = id ?? channelData.id;
  const payload = buildContactPayload(channelData);
  const response = await api.put(`${CONTACT_ENDPOINT}/${channelId}`, payload, {
    params: payload,
  });
  const data = response?.data?.data ?? response?.data;
  return normalizeContact(data);
};

export const updateContact = updateContactChannel;

/**
 * Delete a contact channel by id.
 * DELETE /api/contact-channels/{id}
 *
 * @param {number|string} id - Contact Channel ID
 * @returns {Promise<any>}
 */
export const deleteContactChannel = async (id) => {
  const response = await api.delete(`${CONTACT_ENDPOINT}/${id}`);
  return response?.data;
};

export const deleteContact = deleteContactChannel;

const contactApi = {
  getContactChannels,
  getContacts,
  getAllContactChannels,
  getContactChannelById,
  createContactChannel,
  createContact,
  updateContactChannel,
  updateContact,
  deleteContactChannel,
  deleteContact,
  normalizeContact,
  normalizeContacts,
  buildContactPayload,
  normalizeIconType,
  resolveBadgeColor,
  BADGE_THEME_MAP,
};

export default contactApi;
