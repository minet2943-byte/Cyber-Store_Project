import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../data/products";
import { Actions, Field, Page } from "./CreateProduct";

export default function CreateCategory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", name: "", tagline: "" });
  const [error, setError] = useState("");
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  const submit = (event) => { event.preventDefault(); const id = form.id.trim().toUpperCase(); if (categories.some((category) => category.id === id)) return setError("Category ID must be unique."); categories.push({ id, name: form.name.trim(), tagline: form.tagline.trim(), icon: "Box" }); navigate("/admin/inventory/new"); };
  return <Page title="Create category" back="Back to inventory"><form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Category ID" placeholder="Example: E001" value={form.id} onChange={update("id")} required /><Field label="Category name" value={form.name} onChange={update("name")} required /><Field label="Short tagline" value={form.tagline} onChange={update("tagline")} className="sm:col-span-2" required /><Actions error={error} cancelTo="/admin/inventory" /></form></Page>;
}
