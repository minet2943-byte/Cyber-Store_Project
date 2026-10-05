import api from "./api";
import { categories as fallbackCategories } from "../data/products";

const normalizeCategory = (category, index = 0) => ({
  ...category,
  id:
    category?.id ??
    category?.categoryId ??
    category?.category_id ??
    category?.categoryID ??
    index + 1,
  name:
    category?.name ??
    category?.categoryName ??
    category?.category ??
    `Category ${index + 1}`,
});

const normalizeCategories = (items = []) =>
  Array.isArray(items)
    ? items.map((category, index) => normalizeCategory(category, index))
    : [];

export const createCategory = async (categoryData) => {
  const response = await api.post("/category", categoryData);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/category");
  const payload = response?.data;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : null;

  if (!items) {
    throw new Error("The category API returned an invalid response.");
  }

  return normalizeCategories(items);
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/category/${id}`);
    const payload = response?.data;
    const item = payload?.data ?? payload;

    return item ? normalizeCategory(item) : null;
  } catch (error) {
    console.warn(`Backend unavailable while loading category ${id}.`, error);
    const fallbackCategory = fallbackCategories.find(
      (category) => String(category.id) === String(id),
    );

    return fallbackCategory ? normalizeCategory(fallbackCategory) : null;
  }
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/category/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/category/${id}`);
  return response.data;
};
