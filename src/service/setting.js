import api from "./api";

const SETTINGS_ENDPOINT = "/website-settings";

/**
 * Resolves a banner or backend image path to a full browser-accessible URL.
 * Example:
 *   "/uploads/banners/3bcdf4c7-8bad-45a2-8905-76007dd96093.jpg"
 * becomes:
 *   "http://127.0.0.1:8080/uploads/banners/3bcdf4c7-8bad-45a2-8905-76007dd96093.jpg"
 */
export const resolveImageUrl = (url) => {
  if (!url) return "";

  const value = String(url).trim();
  if (!value) return "";

  // Already an absolute URL, data URI, or blob URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const baseUrl =
    api.defaults?.baseURL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8080/api";

  try {
    const origin = new URL(baseUrl).origin;

    if (value.startsWith("/")) {
      return `${origin}${value}`;
    }

    return `${origin}/uploads/${value}`;
  } catch {
    return value;
  }
};

/**
 * Normalize a single website setting object from backend to frontend format.
 * Matches backend API:
 * {
 *   "settingId": 1,
 *   "websiteName": "Baby",
 *   "logoName": "cyber",
 *   "bannerTitle": "Computer",
 *   "bannerDescription": "Hello everyone",
 *   "bannerImage": "/uploads/banners/3bcdf4c7-8bad-45a2-8905-76007dd96093.jpg"
 * }
 */
export const normalizeSetting = (setting) => {
  if (!setting || typeof setting !== "object") return null;

  const rawBanner =
    setting.bannerImage ??
    setting.banner_image ??
    setting.banner ??
    "";

  const resolvedBanner = resolveImageUrl(rawBanner);

  const websiteName =
    setting.websiteName ??
    setting.website_name ??
    setting.siteName ??
    setting.site_name ??
    "";

  const settingId =
    setting.settingId ??
    setting.setting_id ??
    setting.id ??
    1;

  return {
    ...setting,
    id: settingId,
    settingId,
    websiteName,
    siteName: websiteName,
    logoName: setting.logoName ?? setting.logo_name ?? "",
    bannerTitle: setting.bannerTitle ?? setting.banner_title ?? "",
    bannerDescription:
      setting.bannerDescription ?? setting.banner_description ?? "",
    bannerImage: resolvedBanner || rawBanner,
    rawBannerImage: rawBanner,
  };
};

/**
 * Normalize an array of settings.
 */
export const normalizeSettings = (items = []) => {
  if (!items) return [];

  const list = Array.isArray(items)
    ? items
    : Array.isArray(items?.data)
    ? items.data
    : [items];

  return list.map(normalizeSetting).filter(Boolean);
};

/**
 * Helper to build FormData from a settings object (handling File or Blob).
 */
export const buildSettingsFormData = (data = {}) => {
  const formData = new FormData();

  const id = data.settingId ?? data.id;
  if (id != null) {
    formData.append("settingId", String(id));
  }

  const websiteName = data.websiteName || data.siteName || "";
  formData.append("websiteName", websiteName);
  formData.append("logoName", data.logoName || "");
  formData.append("bannerTitle", data.bannerTitle || "");
  formData.append("bannerDescription", data.bannerDescription || "");

  // Check if bannerFile was passed or bannerImage is a File/Blob instance
  const file =
    data.bannerFile ||
    (data.bannerImage instanceof File || data.bannerImage instanceof Blob
      ? data.bannerImage
      : null) ||
    (data.file instanceof File || data.file instanceof Blob ? data.file : null);

  if (file) {
    formData.append("bannerImage", file);
  } else if (typeof data.bannerImage === "string" && data.bannerImage) {
    formData.append("bannerImage", data.rawBannerImage || data.bannerImage);
  }

  return formData;
};

// ============================================================================
// GET METHODS
// ============================================================================

/**
 * GET Method: Fetch all website settings.
 * GET http://127.0.0.1:8080/api/website-settings
 */
export const getWebsiteSettings = async () => {
  const response = await api.get(SETTINGS_ENDPOINT);
  const payload = response?.data;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : payload
    ? [payload]
    : [];

  return normalizeSettings(items);
};

/**
 * GET Method: Fetch a single website setting by ID (default: 1), or active setting.
 * Attempts GET /website-settings/{id}, with fallback to list matching.
 */
export const getWebsiteSetting = async (id = 1) => {
  try {
    const response = await api.get(`${SETTINGS_ENDPOINT}/${id}`);
    const payload = response?.data;
    const item = payload?.data ?? payload;

    if (item && !Array.isArray(item)) {
      return normalizeSetting(item);
    }
  } catch (err) {
    console.warn(
      `GET ${SETTINGS_ENDPOINT}/${id} not available directly, fetching all settings...`,
      err
    );
  }

  // Fallback: Fetch all and find matching id or first item
  const all = await getWebsiteSettings();
  if (all.length === 0) return null;

  return (
    all.find((s) => String(s.settingId) === String(id)) ??
    all.find((s) => String(s.id) === String(id)) ??
    all[0]
  );
};

export const getWebsiteSettingById = getWebsiteSetting;

// ============================================================================
// POST METHODS (Create setting)
// ============================================================================

/**
 * POST Method: Create a new website setting.
 * Supports:
 * - JSON Object: { websiteName, logoName, bannerTitle, bannerDescription, bannerImage }
 * - Object with File: { websiteName, ..., bannerFile: file } (auto-converts to FormData)
 * - Raw FormData instance
 *
 * POST http://127.0.0.1:8080/api/website-settings
 */
export const postWebsiteSetting = async (data) => {
  const isRawFormData =
    typeof FormData !== "undefined" && data instanceof FormData;

  const hasFile =
    !isRawFormData &&
    (data?.bannerFile instanceof File ||
      data?.bannerFile instanceof Blob ||
      data?.bannerImage instanceof File ||
      data?.bannerImage instanceof Blob ||
      data?.file instanceof File);

  let payload;
  let headers = {};

  if (isRawFormData) {
    payload = data;
    headers["Content-Type"] = "multipart/form-data";
  } else if (hasFile) {
    payload = buildSettingsFormData(data);
    headers["Content-Type"] = "multipart/form-data";
  } else {
    payload = {
      websiteName: data.websiteName || data.siteName || "",
      logoName: data.logoName || "",
      bannerTitle: data.bannerTitle || "",
      bannerDescription: data.bannerDescription || "",
      bannerImage: data.rawBannerImage || data.bannerImage || "",
    };
    headers["Content-Type"] = "application/json";
  }

  const response = await api.post(SETTINGS_ENDPOINT, payload, { headers });
  const resData = response?.data?.data ?? response?.data;
  return normalizeSetting(resData) || resData;
};

export const createWebsiteSetting = postWebsiteSetting;

// ============================================================================
// PUT METHODS (Update setting)
// ============================================================================

/**
 * PUT Method: Update an existing website setting by ID.
 * Supports:
 * - putWebsiteSetting(id, data)
 * - putWebsiteSetting(data) -> id is extracted from data.settingId or data.id (defaults to 1)
 *
 * Supports:
 * - JSON Object: { settingId, websiteName, logoName, bannerTitle, bannerDescription, bannerImage }
 * - Object with File: { settingId, ..., bannerFile: file } (auto-converts to FormData)
 * - Raw FormData instance
 *
 * PUT http://127.0.0.1:8080/api/website-settings/{id}
 */
export const putWebsiteSetting = async (idOrData, maybeData) => {
  let id;
  let data;

  if (maybeData !== undefined) {
    id = idOrData;
    data = maybeData;
  } else {
    data = idOrData;
    id = data?.settingId ?? data?.id ?? 1;
  }

  const isRawFormData =
    typeof FormData !== "undefined" && data instanceof FormData;

  const hasFile =
    !isRawFormData &&
    (data?.bannerFile instanceof File ||
      data?.bannerFile instanceof Blob ||
      data?.bannerImage instanceof File ||
      data?.bannerImage instanceof Blob ||
      data?.file instanceof File);

  let payload;
  let headers = {};

  if (isRawFormData) {
    payload = data;
    headers["Content-Type"] = "multipart/form-data";
  } else if (hasFile) {
    payload = buildSettingsFormData({ ...data, settingId: id });
    headers["Content-Type"] = "multipart/form-data";
  } else if (data && typeof data === "object") {
    payload = {
      settingId: id,
      websiteName: data.websiteName || data.siteName || "",
      logoName: data.logoName || "",
      bannerTitle: data.bannerTitle || "",
      bannerDescription: data.bannerDescription || "",
      bannerImage: data.rawBannerImage || data.bannerImage || "",
    };
    headers["Content-Type"] = "application/json";
  } else {
    payload = data;
  }

  try {
    // Try PUT /website-settings/{id}
    const response = await api.put(`${SETTINGS_ENDPOINT}/${id}`, payload, {
      headers,
    });
    const resPayload = response?.data?.data ?? response?.data;
    return normalizeSetting(resPayload) || resPayload;
  } catch (err) {
    // Fallback: If PUT /website-settings/{id} is not supported, try PUT /website-settings
    console.warn(
      `PUT ${SETTINGS_ENDPOINT}/${id} failed, trying PUT ${SETTINGS_ENDPOINT}...`,
      err
    );
    const fallbackResponse = await api.put(SETTINGS_ENDPOINT, payload, {
      headers,
    });
    const resPayload = fallbackResponse?.data?.data ?? fallbackResponse?.data;
    return normalizeSetting(resPayload) || resPayload;
  }
};

export const updateWebsiteSetting = putWebsiteSetting;

// ============================================================================
// DELETE METHODS (Delete setting)
// ============================================================================

/**
 * DELETE Method: Delete website setting by ID.
 *
 * DELETE http://127.0.0.1:8080/api/website-settings/{id}
 */
export const deleteWebsiteSetting = async (id = 1) => {
  try {
    const response = await api.delete(`${SETTINGS_ENDPOINT}/${id}`);
    return response?.data;
  } catch (err) {
    console.warn(
      `DELETE ${SETTINGS_ENDPOINT}/${id} failed, attempting with query param...`,
      err
    );
    // Fallback: DELETE /website-settings?id={id} or /website-settings?settingId={id}
    const fallbackResponse = await api.delete(SETTINGS_ENDPOINT, {
      params: { id, settingId: id },
    });
    return fallbackResponse?.data;
  }
};

// ============================================================================
// CONVENIENCE ALIASES
// ============================================================================

// GET aliases
export const getSettings = getWebsiteSettings;
export const getSetting = getWebsiteSetting;
export const getSettingById = getWebsiteSetting;

// POST aliases
export const postSetting = postWebsiteSetting;
export const createSetting = postWebsiteSetting;

// PUT aliases
export const putSetting = putWebsiteSetting;
export const updateSetting = putWebsiteSetting;

// DELETE aliases
export const deleteSetting = deleteWebsiteSetting;
export const removeWebsiteSetting = deleteWebsiteSetting;
export const removeSetting = deleteWebsiteSetting;

export default {
  resolveImageUrl,
  normalizeSetting,
  normalizeSettings,
  buildSettingsFormData,

  // GET
  getWebsiteSettings,
  getWebsiteSetting,
  getWebsiteSettingById,
  getSettings,
  getSetting,
  getSettingById,

  // POST
  postWebsiteSetting,
  createWebsiteSetting,
  postSetting,
  createSetting,

  // PUT
  putWebsiteSetting,
  updateWebsiteSetting,
  putSetting,
  updateSetting,

  // DELETE
  deleteWebsiteSetting,
  deleteSetting,
  removeWebsiteSetting,
  removeSetting,
};
