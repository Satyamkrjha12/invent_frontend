"use client";

import React, { useState } from "react";
import { Plus, Trash2, MapPin, ArrowLeft, ArrowRight, Layers } from "lucide-react";

interface Site {
  id: string;
  name: string;
  type: string;
}

interface LocationItem {
  id: string;
  siteId: string;
  name: string;
  description?: string;
}

interface LocationsProps {
  data: {
    sites: Site[];
    locations: LocationItem[];
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Locations({ data, onChange, onNext, onBack }: LocationsProps) {
  const [selectedSiteId, setSelectedSiteId] = useState(data.sites[0]?.id || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedSiteId) return;

    const newLocation: LocationItem = {
      id: Date.now().toString(),
      siteId: selectedSiteId,
      name: name.trim(),
      description: description.trim() || undefined,
    };

    onChange("locations", [...data.locations, newLocation]);

    // Reset fields
    setName("");
    setDescription("");
    setIsAdding(false);
  };

  const handleRemoveLocation = (id: string) => {
    onChange("locations", data.locations.filter((loc) => loc.id !== id));
  };

  const getSiteName = (siteId: string) => {
    const site = data.sites.find((s) => s.id === siteId);
    return site ? site.name : "Unknown Site";
  };

  const isFormValid = name.trim() !== "" && selectedSiteId !== "";
  const hasLocations = data.locations.length > 0;

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-50/50">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Define Bin/Shelf Locations</h2>
        <p className="mt-2 text-sm text-gray-500">
          Create specific storage locations (like Aisle A, Shelf 3, or Cold Storage Room) inside your sites.
        </p>
      </div>

      {/* Locations List */}
      <div className="space-y-4 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Locations Setup</h3>
        {hasLocations ? (
          <div className="grid gap-3">
            {data.locations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:border-orange-200"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-100 p-2.5 text-orange-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-950">{loc.name}</h4>
                    <p className="text-xs text-gray-400">
                      Located in <span className="font-medium text-orange-500">{getSiteName(loc.siteId)}</span>
                      {loc.description ? ` • ${loc.description}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(loc.id)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
            No locations added yet. Add shelves, aisles, or bins to organize inventory.
          </div>
        )}
      </div>

      {/* Add Location Form */}
      {!isAdding ? (
        <button
          type="button"
          onClick={() => {
            // Update selectedSiteId if it's empty but we have sites
            if (!selectedSiteId && data.sites.length > 0) {
              setSelectedSiteId(data.sites[0].id);
            }
            setIsAdding(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-orange-300 rounded-2xl text-sm font-semibold text-orange-600 bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Add Storage Location
        </button>
      ) : (
        <form onSubmit={handleAddLocation} className="rounded-2xl border border-orange-100 bg-orange-50/30 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <h4 className="text-sm font-semibold text-gray-900">New Location Details</h4>
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
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Site Location</label>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="w-full rounded-xl border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 bg-white"
              >
                {data.sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Location Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aisle 4, Shelf C"
                className="w-full rounded-xl border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. For pallet rack storage, temperature controlled"
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
              Save Location
            </button>
          </div>
        </form>
      )}

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
          disabled={!hasLocations}
          onClick={onNext}
          className={`inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-white rounded-2xl shadow-lg transition-all duration-200
            ${
              hasLocations
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
