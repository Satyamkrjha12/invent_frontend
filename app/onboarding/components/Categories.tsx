"use client";

import React, { useState } from "react";
import { Check, Plus, Tag, ArrowLeft, ArrowRight } from "lucide-react";

interface CategoriesProps {
  data: {
    categories: string[];
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_CATEGORIES = [
  "Electronics & Devices",
  "Office Supplies",
  "Furniture & Fittings",
  "Raw Materials",
  "Tools & Equipment",
  "Finished Goods",
  "Packaging Materials",
  "Spare Parts",
  "Safety Gear",
];

export default function Categories({ data, onChange, onNext, onBack }: CategoriesProps) {
  const [customName, setCustomName] = useState("");

  const toggleCategory = (categoryName: string) => {
    const isSelected = data.categories.includes(categoryName);
    let updated: string[];

    if (isSelected) {
      updated = data.categories.filter((c) => c !== categoryName);
    } else {
      updated = [...data.categories, categoryName];
    }
    onChange("categories", updated);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customName.trim();
    if (!trimmed) return;

    if (!data.categories.includes(trimmed)) {
      onChange("categories", [...data.categories, trimmed]);
    }
    setCustomName("");
  };

  const hasSelected = data.categories.length > 0;

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-50/50">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Configure Categories</h2>
        <p className="mt-2 text-sm text-gray-500">
          Group your inventory into categories. Select standard categories or add custom ones.
        </p>
      </div>

      <div className="space-y-6">
        {/* Preset grid */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select standard categories
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PRESET_CATEGORIES.map((cat) => {
              const isSelected = data.categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-2.5 rounded-2xl border p-3.5 text-left text-sm font-medium transition-all duration-200
                    ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm shadow-orange-100/50"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors
                    ${isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 bg-white"}`}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span className="truncate">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom category input */}
        <form onSubmit={handleAddCustom} className="border-t border-gray-100 pt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Add custom category
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1 rounded-2xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Marketing Merchandise"
                className="block w-full rounded-2xl border-gray-200 pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={!customName.trim()}
              className={`flex items-center justify-center gap-1.5 px-5 rounded-2xl font-semibold text-sm transition-all duration-200
                ${
                  customName.trim()
                    ? "bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-200 cursor-pointer"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                }`}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </form>

        {/* Selected custom categories list */}
        {data.categories.filter((c) => !PRESET_CATEGORIES.includes(c)).length > 0 && (
          <div className="mt-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Custom Added:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.categories
                .filter((c) => !PRESET_CATEGORIES.includes(c))
                .map((customCat) => (
                  <span
                    key={customCat}
                    onClick={() => toggleCategory(customCat)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 border border-orange-100 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100 cursor-pointer transition-colors"
                  >
                    {customCat}
                    <span className="text-orange-400 font-bold hover:text-orange-600">×</span>
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 border-t border-gray-100 pt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-gray-600 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          disabled={!hasSelected}
          onClick={onNext}
          className={`inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-white rounded-2xl shadow-lg transition-all duration-200
            ${
              hasSelected
                ? "bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] shadow-orange-200 active:scale-95 cursor-pointer"
                : "bg-gray-300 shadow-none cursor-not-allowed"
            }`}
        >
          Next Step
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
