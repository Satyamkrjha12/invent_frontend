"use client";

import React, { useState } from "react";
import { Warehouse, Store, MapPin, Plus, Trash2, Home, Truck, Layers } from "lucide-react";

interface Site {
  id: string;
  name: string;
  type: "warehouse" | "storefront" | "office" | "mobile";
  address: string;
  itemCount: number;
  locations: string[];
}

const INITIAL_SITES: Site[] = [
  {
    id: "1",
    name: "Primary Warehouse",
    type: "warehouse",
    address: "100 Industrial Pkwy, Sector 4",
    itemCount: 842,
    locations: ["Aisle A, Shelf 1", "Aisle B, Bin 3", "Cold Storage Room"],
  },
  {
    id: "2",
    name: "HQ Storefront",
    type: "storefront",
    address: "42 Retail Blvd, Suite A",
    itemCount: 406,
    locations: ["Front Display Rack", "Backroom Shelf C"],
  },
];

export default function SitesTab() {
  const [sites, setSites] = useState<Site[]>(INITIAL_SITES);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Sites & Storage Bins</h1>
          <p className="text-sm text-gray-500 font-medium">Manage physically separated warehouses, stores, and specific bins.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all cursor-pointer">
          <Plus className="h-4.5 w-4.5" />
          Add Site
        </button>
      </div>

      {/* Grid of Sites */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sites.map((site) => {
          const SiteIcon = getIcon(site.type);
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
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{site.type}</p>
                    </div>
                  </div>

                  <button className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Info Rows */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                    <span>{site.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Layers className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                    <span className="font-bold text-gray-950">{site.itemCount}</span> items active in stock
                  </div>
                </div>

                {/* Sub Locations List */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sub Locations / Bins</h4>
                    <button className="text-3xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5">
                      <Plus className="h-3 w-3" />
                      Add Bin
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {site.locations.map((loc, i) => (
                      <span
                        key={i}
                        className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-1.5 text-2xs font-semibold text-gray-600 flex items-center gap-1.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
