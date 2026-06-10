"use client";

import React, { useState } from "react";
import { Search, Plus, Filter, Edit2, Trash2, ArrowUpDown } from "lucide-react";

interface Item {
  sku: string;
  name: string;
  category: string;
  qty: number;
  site: string;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const INITIAL_ITEMS: Item[] = [
  { sku: "LP-PRO-16", name: "Pro Laptop 16-inch", category: "Electronics & Devices", qty: 24, site: "Primary Warehouse", price: 1299, status: "In Stock" },
  { sku: "MO-HD-27", name: "Ultra HD Monitor 27-inch", category: "Electronics & Devices", qty: 15, site: "Primary Warehouse", price: 349, status: "In Stock" },
  { sku: "OF-CH-01", name: "Ergonomic Desk Chair", category: "Furniture & Fittings", qty: 4, site: "HQ Storefront", price: 189, status: "Low Stock" },
  { sku: "TL-DR-12", name: "Cordless Drill Set 12V", category: "Tools & Equipment", qty: 0, site: "HQ Storefront", price: 89, status: "Out of Stock" },
  { sku: "PK-BX-M", name: "Medium Cardboard Boxes", category: "Packaging Materials", qty: 450, site: "Primary Warehouse", price: 1.5, status: "In Stock" },
  { sku: "SF-GL-05", name: "Anti-fog Safety Goggles", category: "Safety Gear", qty: 2, site: "Primary Warehouse", price: 12, status: "Low Stock" },
];

export default function Inventory() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Inventory Items</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and monitor stock levels across warehouses.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all cursor-pointer">
          <Plus className="h-4.5 w-4.5" />
          Add Item
        </button>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                  <td className="py-4 text-xs font-medium text-gray-500">{item.category}</td>
                  <td className="py-4">
                    <span className="font-bold text-gray-950">{item.qty}</span>
                  </td>
                  <td className="py-4 text-xs font-medium text-gray-500">{item.site}</td>
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
                      <button className="rounded-lg p-1.5 text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer">
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
    </div>
  );
}
