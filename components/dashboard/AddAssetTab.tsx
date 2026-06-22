"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Layers,
  FolderOpen
} from "lucide-react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

export default function AddAssetTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    parentName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch current categories
  const loadCategories = async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true);
      const invRes = await api.get("/inventory");
      setCategories(invRes.categories || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories(true);
  }, []);

  const triggerNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      triggerNotification("error", "Category name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/categories", {
        name: categoryForm.name.trim(),
        parentName: categoryForm.parentName || null,
      });

      triggerNotification("success", `Category "${categoryForm.name}" created successfully!`);
      setCategoryForm({ name: "", parentName: "" });
      
      // Refresh category list
      await loadCategories();
    } catch (err: any) {
      console.error(err);
      triggerNotification("error", err.message || "Failed to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Category Management</h1>
        <p className="text-sm text-gray-500 font-medium font-sans">
          Create and view categories to organize your warehouse inventory catalog.
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold transition-all border animate-in fade-in slide-in-from-top-4 duration-300 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-800"
              : "bg-red-50 border-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Form Column */}
        <div className="lg:col-span-7 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <form onSubmit={handleCreateCategory} className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-gray-50 pb-4">
              <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">Add New Category</h2>
                <p className="text-xs text-gray-400 font-medium">Create a new category for grouping stock items.</p>
              </div>
            </div>

            <div className="space-y-5">
              <Input
                id="categoryName"
                label="Category Name *"
                placeholder="e.g. Computing Peripherals"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                required
              />

              <div>
                <label htmlFor="parentCategory" className="mb-2 block text-sm font-medium text-slate-700">
                  Parent Category (Optional)
                </label>
                <select
                  id="parentCategory"
                  value={categoryForm.parentName}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parentName: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100 bg-white"
                >
                  <option value="">None (Top-level Category)</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50">
              <Button type="submit" isLoading={isSubmitting} className="flex items-center gap-2">
                <PlusCircle className="h-4.5 w-4.5" />
                Save Category
              </Button>
            </div>
          </form>
        </div>

        {/* Existing Categories Column */}
        <div className="lg:col-span-5 rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 border-b border-gray-50 pb-4 mb-4">
              <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">Active Categories</h2>
                <p className="text-xs text-gray-400 font-medium">Currently configured catalog groups.</p>
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {categories.length > 0 ? (
                categories.map((c, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl bg-gray-50/50 hover:bg-orange-50/10 border border-gray-100 p-3.5 transition-colors"
                  >
                    <Layers className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-semibold text-slate-800">{c}</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-sm italic">
                  No categories added yet.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4 mt-6">
            <span className="text-[11px] font-medium text-gray-400">
              Note: Categories can be assigned to items when creating or editing them.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
