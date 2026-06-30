"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Filter, Edit2, Trash2, ArrowUpDown, X, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/utils/api";
import { Spinner } from "@/components/ui/Spinner";
import { useOnboarding } from "@/context/OnboardingContext";

interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
}

const itemSchema = z.object({
  sku: z.string().min(3, "SKU must be at least 3 characters").toUpperCase(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  qty: z.number({ message: "Quantity must be a number" }).min(0, "Quantity cannot be negative"),
  siteId: z.string().min(1, "Storage site is required"),
  locationId: z.string().optional().nullable(),
  unitOfMeasure: z.string().optional().nullable(),
  price: z.number({ message: "Price must be a number" }).min(0.01, "Price must be at least 0.01"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function Inventory() {
  const { searchQuery, setSearchQuery } = useOnboarding();
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryParents, setCategoryParents] = useState<{ [key: string]: string }>({});
  const [uoms, setUoms] = useState<any[]>([]);
  const [sitesList, setSitesList] = useState<any[]>([]);
  const [locationsList, setLocationsList] = useState<any[]>([]);

  const [filterCategory, setFilterCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      sku: "",
      name: "",
      category: "",
      qty: 0,
      siteId: "",
      locationId: "",
      unitOfMeasure: "Pieces",
      price: 0.01,
    },
  });

  const selectedSiteId = watch("siteId");

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      const [invRes, sitesRes, categoriesRes] = await Promise.all([
        api.get(`/inventory?search=${encodeURIComponent(searchQuery)}`),
        api.get("/sites"),
        api.get("/categories"),
      ]);
      setItems(invRes.items || []);
      setCategories(invRes.categories || []);
      setUoms(invRes.unitsOfMeasure || []);
      setSitesList(sitesRes.sites || []);
      setLocationsList(sitesRes.allLocations || []);

      // Build child -> parent category lookup map from the tree
      const parentMap: { [key: string]: string } = {};
      const traverse = (node: CategoryNode, parentName: string | null) => {
        if (parentName) {
          parentMap[node.name] = parentName;
        }
        if (node.children) {
          node.children.forEach((child) => traverse(child, node.name));
        }
      };

      const categoryTree: CategoryNode[] = categoriesRes.categories || [];
      categoryTree.forEach((node) => traverse(node, null));
      setCategoryParents(parentMap);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [searchQuery]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    reset({
      sku: "",
      name: "",
      category: categories[0] || "Electronics & Devices",
      qty: 0,
      siteId: sitesList[0]?.id || "",
      locationId: "",
      unitOfMeasure: uoms[0]?.name || "Pieces",
      price: 0.01,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    reset({
      sku: item.sku,
      name: item.name,
      category: item.category || "",
      qty: item.qty || 0,
      siteId: item.siteId || "",
      locationId: item.locationId || "",
      unitOfMeasure: item.unitOfMeasure || "Pieces",
      price: item.price || 0.01,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        // Update item (PUT /api/inventory/:sku)
        await api.put(`/inventory/${editingItem.sku}`, data);
      } else {
        // Create item (POST /api/inventory)
        await api.post("/inventory", data);
      }
      setIsModalOpen(false);
      reset();
      await loadInventory();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (sku: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/inventory/${sku}`);
      await loadInventory();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete item.");
    }
  };

  const isDescendant = (childCategory: string, parentCategory: string): boolean => {
    let current = childCategory;
    while (current && categoryParents[current]) {
      const parent = categoryParents[current];
      if (parent === parentCategory) {
        return true;
      }
      current = parent;
    }
    return false;
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      filterCategory === "all" ||
      item.category === filterCategory ||
      (item.category && isDescendant(item.category, filterCategory));
    return matchesCategory;
  });

  const filteredLocations = locationsList.filter(
    (loc) => loc.siteId === selectedSiteId
  );

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Inventory Items</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and monitor stock levels across warehouses.</p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Item
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search SKU or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500/50 focus:outline-none border focus:ring-4 focus:ring-orange-500/5 transition-all"
          />
        </div>

        {/* Categories Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
            <Filter className="h-4 w-4" />
            Filter
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none border focus:ring-4 focus:ring-orange-500/5 transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm text-gray-600">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="pb-4 pt-2 font-semibold flex items-center gap-1">
                SKU / Name <ArrowUpDown className="h-3 w-3" />
              </th>
              <th className="pb-4 pt-2 font-semibold">Category</th>
              <th className="pb-4 pt-2 font-semibold">Qty</th>
              <th className="pb-4 pt-2 font-semibold">Site Location</th>
              <th className="pb-4 pt-2 font-semibold">Price</th>
              <th className="pb-4 pt-2 font-semibold">Status</th>
              <th className="pb-4 pt-2 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.sku} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="py-4">
                    <div>
                      <span className="font-bold text-gray-950 block">{item.name}</span>
                      <span className="text-3xs font-semibold uppercase text-gray-400 bg-gray-100/80 rounded px-1.5 py-0.5 mt-1 inline-block">
                        {item.sku}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-medium text-gray-500">{item.category || "None"}</td>
                  <td className="py-4">
                    <span className="font-bold text-gray-950">{item.qty} {item.unitOfMeasure || "pcs"}</span>
                  </td>
                  <td className="py-4 text-xs font-medium text-gray-500">
                    {item.site || "N/A"}{item.location ? ` - ${item.location}` : ""}
                  </td>
                  <td className="py-4 font-bold text-gray-950">${item.price.toFixed(2)}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-3xs font-bold uppercase
                        ${
                          item.status === "In Stock"
                            ? "bg-emerald-50 text-emerald-600"
                            : item.status === "Low Stock"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.sku)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                  No items matched your filter or search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-orange-500" />
                {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="sku"
                  label="SKU Code"
                  placeholder="e.g. HW-MOU-01"
                  disabled={!!editingItem} // SKU is primary key, cannot edit
                  error={errors.sku?.message}
                  {...register("sku")}
                />
                <Input
                  id="name"
                  label="Item Name"
                  placeholder="e.g. Optical Mouse"
                  error={errors.name?.message}
                  {...register("name")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100 bg-white"
                    {...register("category")}
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))
                    ) : (
                      <option value="">No Categories Available</option>
                    )}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="unitOfMeasure" className="mb-2 block text-sm font-medium text-slate-700">
                    Unit of Measure
                  </label>
                  <select
                    id="unitOfMeasure"
                    className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100 bg-white"
                    {...register("unitOfMeasure")}
                  >
                    {uoms.map((u) => (
                      <option key={u.name} value={u.name}>
                        {u.name} ({u.abbreviation})
                      </option>
                    ))}
                  </select>
                  {errors.unitOfMeasure && (
                    <p className="mt-1 text-xs text-red-500">{errors.unitOfMeasure.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="siteId" className="mb-2 block text-sm font-medium text-slate-700">
                    Storage Site
                  </label>
                  <select
                    id="siteId"
                    className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100 bg-white"
                    {...register("siteId")}
                  >
                    {sitesList.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                  {errors.siteId && (
                    <p className="mt-1 text-xs text-red-500">{errors.siteId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="locationId" className="mb-2 block text-sm font-medium text-slate-700">
                    Bin / Sub-location
                  </label>
                  <select
                    id="locationId"
                    className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100 bg-white"
                    {...register("locationId")}
                  >
                    <option value="">No Location Selected</option>
                    {filteredLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                  {errors.locationId && (
                    <p className="mt-1 text-xs text-red-500">{errors.locationId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="qty"
                  type="number"
                  label="Quantity"
                  placeholder="0"
                  error={errors.qty?.message}
                  {...register("qty", { valueAsNumber: true })}
                />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  label="Unit Price ($)"
                  placeholder="0.00"
                  error={errors.price?.message}
                  {...register("price", { valueAsNumber: true })}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  {editingItem ? "Update Item" : "Save Item"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
