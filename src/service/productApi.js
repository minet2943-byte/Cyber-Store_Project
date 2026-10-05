import api from "./api";
import { products as fallbackProducts } from "../data/products";

/**
 * Convert backend image value into a browser-accessible URL.
 *
 * Backend example:
 *   "Bacall.jpg"
 *
 * Becomes:
 *   "http://localhost:8080/uploads/Bacall.jpg"
 */
const resolveImageUrl = (url) => {
  if (!url) return "";

  const value = String(url).trim();

  if (!value) return "";

  // Already a complete URL or browser URL
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const baseUrl = api.defaults.baseURL;

  if (!baseUrl) {
    return value;
  }

  const origin = new URL(baseUrl).origin;

  // Example: /uploads/Bacall.jpg
  if (value.startsWith("/uploads/")) {
    return `${origin}${value}`;
  }

  // Example: /api/...
  if (value.startsWith("/api/")) {
    return `${origin}${value}`;
  }

  // Any other absolute path
  if (value.startsWith("/")) {
    return `${origin}${value}`;
  }

  // Backend currently returns:
  // Bacall.jpg
  //
  // Therefore we assume:
  // http://localhost:8080/uploads/Bacall.jpg
  return `${origin}/uploads/${value}`;
};

/**
 * Get image URL from different possible backend formats.
 */
const getImageUrl = (image) => {
  if (typeof image === "string") {
    return resolveImageUrl(image);
  }

  if (!image || typeof image !== "object") {
    return "";
  }

  const url =
    image.imageUrl ??
    image.image_url ??
    image.imageName ??
    image.image_name ??
    image.fileName ??
    image.file_name ??
    image.url ??
    image.path ??
    image.imagePath ??
    image.image;

  return url ? resolveImageUrl(url) : "";
};

/**
 * Normalize one product from Spring Boot API.
 */
const normalizeProduct = (product, index = 0) => {
  const mainImage = getImageUrl(
    product?.imageUrl ??
      product?.image_url ??
      product?.productImage ??
      product?.product_image ??
      product?.image ??
      "",
  );

  const productImages = Array.isArray(product?.images)
    ? product.images.map(getImageUrl).filter(Boolean)
    : [];

  const images =
    productImages.length > 0
      ? productImages
      : mainImage
        ? [mainImage]
        : [];

  return {
    ...product,

    // ID
    id:
      product?.id ??
      product?.productId ??
      product?.productID ??
      index + 1,

    // Name
    name:
      product?.name ??
      product?.productName ??
      `Product ${index + 1}`,

    description:
      product?.description ??
      product?.productDescription ??
      "",

    // Category
    category:
      product?.category ??
      product?.categoryId ??
      product?.category_id ??
      product?.categoryID ??
      "",

    // Price
    price: Number(
      product?.price ??
        product?.productPrice ??
        0,
    ),

    // Stock
    stock: Number(
      product?.stock ??
        product?.productStock ??
        0,
    ),

    // Rating
    rating: Number(
      product?.rating ??
        product?.reviewRating ??
        0,
    ),

    // Review count
    reviewCount: Number(
      product?.reviewCount ??
        product?.reviews ??
        0,
    ),

    // Main image
    imageUrl: mainImage,

    // All images
    images,

    variants: Array.isArray(product?.variants)
      ? product.variants
      : [],

    specs: Array.isArray(product?.specs)
      ? product.specs
      : [
          ["Processor", product?.cpu],
          ["Graphics Card", product?.gpu],
          [
            "RAM",
            product?.ram == null ? "" : `${product.ram} GB`,
          ],
          ["Specifications", product?.specifications],
        ]
          .filter(([, value]) => value != null && String(value).trim())
          .map(([label, value]) => ({ label, value: String(value) })),
  };
};

/**
 * Normalize product list.
 */
const normalizeProducts = (items = []) => {
  return Array.isArray(items)
    ? items.map((product, index) =>
        normalizeProduct(product, index),
      )
    : [];
};

const getProductImages = async (productId) => {
  const response = await api.get(
    `/product-images/product/${productId}`,
  );
  const payload =
    response?.data?.data ??
    response?.data;
  const images = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.images)
      ? payload.images
      : [];

  return images.map(getImageUrl).filter(Boolean);
};

const addProductImages = async (product) => {
  try {
    const images = await getProductImages(product.id);
    if (images.length === 0) return product;

    return {
      ...product,
      imageUrl: images[0],
      images,
    };
  } catch (error) {
    console.warn(
      `Could not load images for product ${product.id}.`,
      error,
    );
    return product;
  }
};

/**
 * Create product
 */
export const createProduct = async (payload) => {
  try {
    const isFormData =
      typeof FormData !== "undefined" &&
      payload instanceof FormData;

    const response = await api.post(
      "/product",
      payload,
      {
        headers: isFormData
          ? {
              "Content-Type":
                "multipart/form-data",
            }
          : {
              "Content-Type":
                "application/json",
            },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create product API error:",
      error,
    );

    throw error;
  }
};

/**
 * Upload product images
 */
export const createProductImages = async (
  productId,
  files,
) => {
  const formData = new FormData();

  formData.append(
    "productId",
    String(productId),
  );

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post(
    "/product-images",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return response.data;
};

/**
 * Replace product image
 */
export const replaceProductImage = async (
  productId,
  file,
) => {
  const response = await api.get(
    `/product-images/product/${productId}`,
  );

  const payload =
    response?.data?.data ??
    response?.data;

  const images = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.images)
      ? payload.images
      : [];

  const existingImage = images.find(
    (image) =>
      image?.imageId ??
      image?.id,
  );

  const imageId =
    existingImage?.imageId ??
    existingImage?.id;

  // No existing image
  if (imageId == null) {
    return createProductImages(
      productId,
      [file],
    );
  }

  const formData = new FormData();

  formData.append("image", file);

  const updateResponse = await api.put(
    `/product-images/${imageId}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );

  return updateResponse.data;
};

/**
 * Get all products
 */
export const getProducts = async () => {
  try {
    const response = await api.get(
      "/product",
    );

    const payload = response?.data;

    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : fallbackProducts;

    const products = normalizeProducts(items);
    return Promise.all(products.map(addProductImages));
  } catch (error) {
    console.warn(
      "Backend unavailable; using fallback product data.",
      error,
    );

    return normalizeProducts(
      fallbackProducts,
    );
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(
      `/product/${id}`,
    );

    const payload = response?.data;

    const item =
      payload?.data ?? payload;

    if (!item) {
      const availableProducts =
        await getProducts();

      return (
        availableProducts.find(
          (product) =>
            String(product.id) ===
            String(id),
        ) ?? null
      );
    }

    const product = normalizeProduct(
      Array.isArray(item)
        ? item[0]
        : item,
    );
    return addProductImages(product);
  } catch (error) {
    console.warn(
      `Backend unavailable while loading product ${id}.`,
      error,
    );

    const availableProducts =
      await getProducts();

    const fallbackProduct =
      availableProducts.find(
        (product) =>
          String(product.id) ===
          String(id),
      );

    return fallbackProduct
      ? normalizeProduct(
          fallbackProduct,
        )
      : null;
  }
};

/**
 * Update product
 */
export const updateProduct = async (
  id,
  formData,
) => {
  const isFormData =
    typeof FormData !== "undefined" &&
    formData instanceof FormData;

  const response = await api.put(
    `/product/${id}`,
    formData,
    {
      headers: isFormData
        ? {
            "Content-Type":
              "multipart/form-data",
          }
        : {},
    },
  );

  return response.data;
};

/**
 * Delete product
 */
export const deleteProduct = async (
  id,
) => {
  const response = await api.delete(
    `/product/${id}`,
  );

  return response.data;
};