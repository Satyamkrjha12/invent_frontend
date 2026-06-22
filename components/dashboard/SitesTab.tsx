"use client";

import React, { useState, useEffect } from "react";
import { Warehouse, Store, MapPin, Plus, Trash2, Home, Truck, Layers, X, FolderPlus } from "lucide-react";
import { api } from "@/utils/api";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SitesTab() {
  const [sitesList, setSitesList] = useState<any[]>([]);
  const [locationsList, setLocationsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [isBinModalOpen, setIsBinModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  // Forms state
  const [siteForm, setSiteForm] = useState({ name: "", type: "warehouse", address: "" });
  const [binForm, setBinForm] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "storefront":
        return Store;
      case "office":
        return Home;
      case "mobile":
        return Truck;
      default:
        return Warehouse;
    }
  };

  const loadSites = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/sites");
      setSitesList(res.sites || []);
      setLocationsList(res.allLocations || []);
    } catch (err) {
      console.error("Failed to load sites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteForm.name.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post("/sites", siteForm);
      setIsSiteModalOpen(false);
      setSiteForm({ name: "", type: "warehouse", address: "" });
      await loadSites();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create site");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteId || !binForm.name.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post(`/sites/${selectedSiteId}/bins`, binForm);
      setIsBinModalOpen(false);
      setBinForm({ name: "", description: "" });
      await loadSites();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create bin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSite = async (id: string) => {
    if (!confirm("Are you sure you want to delete this storage site? All its bins will be removed.")) return;
    try {
      await api.delete(`/sites/${id}`);
      await loadSites();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete site");
    }
  };

  const handleRemoveBin = async (binId: string) => {
    if (!confirm("Are you sure you want to delete this bin location?")) return;
    try {
      await api.delete(`/sites/bins/${binId}`);
      await loadSites();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete bin");
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Sites & Storage Bins</h1>
          <p className="text-sm text-gray-500 font-medium font-sans">
            Manage physically separated warehouses, stores, and specific bins.
          </p>
        </div>
        <button
          onClick={() => setIsSiteModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Site
        </button>
      </div>

      {/* Grid of Sites */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sitesList.map((site) => {
          const SiteIcon = getIcon(site.type);
          const siteLocations = locationsList.filter((loc) => loc.siteId === site.id);

          return (
            <div
              key={site.id}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Site Header */}
                <div className="flex items-start justify-between border-b border-gray-50 pb-4 mb-4">
                  <div className="flex gap-3.5">
                    <div className="rounded-2xl bg-orange-50 text-orange-600 p-3">
                      <SiteIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-950">{site.name}</h3>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                        {site.type}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveSite(site.id)}
                    className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Info Rows */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                    <span>{site.address || "No address provided"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Layers className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                    <span className="font-bold text-gray-950">Active</span> in tracking
                  </div>
                </div>

                {/* Sub Locations List */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Sub Locations / Bins
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedSiteId(site.id);
                        setIsBinModalOpen(true);
                      }}
                      className="text-3xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Add Bin
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {siteLocations.length > 0 ? (
                      siteLocations.map((loc) => (
                        <span
                          key={loc.id}
                          className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-1.5 text-2xs font-semibold text-gray-600 flex items-center gap-2 group/tag"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                          {loc.name}
                          <button
                            onClick={() => handleRemoveBin(loc.id)}
                            className="text-gray-300 hover:text-red-500 ml-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-2xs text-gray-400 italic">
                        No custom bins added for this site.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Site Modal */}
      {isSiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-orange-500" />
                Add New Storage Site
              </h3>
              <button
                onClick={() => setIsSiteModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-4">
              <div>
                <label htmlFor="siteName" className="mb-2 block text-sm font-medium text-slate-700">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  required
                  placeholder="e.g. West Coast Facility"
                  value={siteForm.name}
                  onChange={(e) => setSiteForm({ ...siteForm, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label htmlFor="siteType" className="mb-2 block text-sm font-medium text-slate-700">
                  Site Type
                </label>
                <select
                  id="siteType"
                  value={siteForm.type}
                  onChange={(e) => setSiteForm({ ...siteForm, type: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100 bg-white"
                >
                  <option value="warehouse">Warehouse</option>
                  <option value="storefront">Storefront</option>
                  <option value="office">Office / HQ</option>
                  <option value="mobile">Mobile Site / Truck</option>
                </select>
              </div>

              <div>
                <label htmlFor="siteAddress" className="mb-2 block text-sm font-medium text-slate-700">
                  Address
                </label>
                <input
                  type="text"
                  id="siteAddress"
                  placeholder="e.g. 123 Logistics Way, Suite A"
                  value={siteForm.address}
                  onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" type="button" onClick={() => setIsSiteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Save Site
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bin Modal */}
      {isBinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-orange-500" />
                Add Storage Bin
              </h3>
              <button
                onClick={() => setIsBinModalOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBin} className="space-y-4">
              <div>
                <label htmlFor="binName" className="mb-2 block text-sm font-medium text-slate-700">
                  Bin Name / Identifier
                </label>
                <input
                  type="text"
                  id="binName"
                  required
                  placeholder="e.g. Shelf B, Bin 4"
                  value={binForm.name}
                  onChange={(e) => setBinForm({ ...binForm, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label htmlFor="binDesc" className="mb-2 block text-sm font-medium text-slate-700">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  id="binDesc"
                  placeholder="e.g. Bulk electronics storage"
                  value={binForm.description}
                  onChange={(e) => setBinForm({ ...binForm, description: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="ghost" type="button" onClick={() => setIsBinModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Save Bin
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
