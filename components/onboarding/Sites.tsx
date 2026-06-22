"use client";

import React, { useState } from "react";
import { Plus, Trash2, Warehouse, Store, Home, Truck, ArrowLeft, ArrowRight } from "lucide-react";
import { useOnboarding, SiteData } from "@/context/OnboardingContext";

const SITE_TYPES = [
  { value: "warehouse", label: "Warehouse", icon: Warehouse },
  { value: "storefront", label: "Storefront / Retail", icon: Store },
  { value: "office", label: "Office / Headquarters", icon: Home },
  { value: "mobile", label: "Mobile Unit / Vehicle", icon: Truck },
];

export default function Sites() {
  const { sites, setSites, nextStep, backStep } = useOnboarding();

  const [name, setName] = useState("");
  const [type, setType] = useState("warehouse");
  const [address, setAddress] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSite: SiteData = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
      address: address.trim() || undefined || "",
    };

    setSites([...sites, newSite]);

    // Reset form
    setName("");
    setType("warehouse");
    setAddress("");
    setIsAdding(false);
  };

  const handleRemoveSite = (id: string) => {
    setSites(sites.filter((site) => site.id !== id));
  };

  const getSiteIcon = (type: string) => {
    const matched = SITE_TYPES.find((t) => t.value === type);
    return matched ? matched.icon : Warehouse;
  };

  const isFormValid = name.trim() !== "";
  const hasSites = sites.length > 0;

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-50/50">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Configure Storage Sites</h2>
        <p className="mt-2 text-sm text-gray-500">
          Add the warehouses, brick-and-mortar stores, or distribution centers where your inventory is held.
        </p>
      </div>

      {/* Sites List */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Your Sites</h3>
        {hasSites ? (
          <div className="grid gap-3">
            {sites.map((site) => {
              const Icon = getSiteIcon(site.type);
              return (
                <div
                  key={site.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:border-orange-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-950">{site.name}</h4>
                      <p className="text-xs text-gray-400 capitalize">
                        {site.type} {site.address ? `• ${site.address}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSite(site.id)}
                    className="rounded-xl p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
            No sites added yet. Add your first storage site below.
          </div>
        )}
      </div>

      {/* Add Site Section */}
      {!isAdding ? (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-orange-300 rounded-2xl text-sm font-semibold text-orange-600 bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Add Another Site
        </button>
      ) : (
        <form onSubmit={handleAddSite} className="rounded-2xl border border-orange-100 bg-orange-50/30 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <h4 className="text-sm font-semibold text-gray-900">New Site Details</h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Site Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Main Warehouse"
                className="w-full rounded-xl border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Site Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 bg-white"
              >
                {SITE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Address (Optional)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 100 Industrial Parkway"
              className="w-full rounded-xl border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-xl transition-colors
                ${isFormValid ? "bg-orange-500 hover:bg-orange-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
            >
              Save Site
            </button>
          </div>
        </form>
      )}

      {/* Navigation */}
      <div className="mt-8 border-t border-gray-100 pt-6 flex justify-between">
        <button
          type="button"
          onClick={backStep}
          className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-gray-600 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          disabled={!hasSites}
          onClick={nextStep}
          className={`inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-white rounded-2xl shadow-lg transition-all duration-200
            ${
              hasSites
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
