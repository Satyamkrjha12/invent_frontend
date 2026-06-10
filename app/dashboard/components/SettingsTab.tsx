"use client";

import React, { useState } from "react";
import { Settings, Save, Bell, Shield, ToggleLeft, ToggleRight, Database } from "lucide-react";

export default function SettingsTab() {
  const [lowStockLimit, setLowStockLimit] = useState(10);
  const [skuPrefix, setSkuPrefix] = useState("INV-");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoReorder, setAutoReorder] = useState(false);
  const [apiTracking, setApiTracking] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Configuration Settings</h1>
        <p className="text-sm text-gray-500 font-medium">Fine-tune inventory alerts, barcodes, notifications, and security rules.</p>
      </div>

      <div className="space-y-6">
        {/* Inventory System Settings */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <Database className="h-4.5 w-4.5" />
            Inventory Settings
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Low Stock Threshold Limit</label>
              <input
                type="number"
                value={lowStockLimit}
                onChange={(e) => setLowStockLimit(parseInt(e.target.value) || 0)}
                className="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm focus:border-orange-500/50 focus:outline-none border focus:ring-4 focus:ring-orange-500/5 transition-all"
              />
              <p className="text-3xs text-gray-400 mt-1.5 leading-normal">
                Items drop below this quantity will flag low stock warnings.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Automated SKU Prefix</label>
              <input
                type="text"
                value={skuPrefix}
                onChange={(e) => setSkuPrefix(e.target.value)}
                className="w-full rounded-2xl border-gray-200 px-4 py-3 text-sm focus:border-orange-500/50 focus:outline-none border focus:ring-4 focus:ring-orange-500/5 transition-all"
              />
              <p className="text-3xs text-gray-400 mt-1.5 leading-normal">
                Standard characters prepended to new assets barcodes.
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <Bell className="h-4.5 w-4.5" />
            Notification Rules
          </h3>

          <div className="space-y-4">
            {/* Rule 1 */}
            <div
              onClick={() => setEmailAlerts(!emailAlerts)}
              className="flex items-center justify-between cursor-pointer py-1"
            >
              <div>
                <h4 className="text-sm font-bold text-gray-900">Email Low Stock Warnings</h4>
                <p className="text-xs text-gray-400 leading-normal mt-0.5">Receive daily notifications for critical items.</p>
              </div>
              <button type="button">
                {emailAlerts ? (
                  <ToggleRight className="h-9 w-9 stroke-1 text-orange-600 fill-orange-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9 stroke-1 text-gray-300" />
                )}
              </button>
            </div>

            {/* Rule 2 */}
            <div
              onClick={() => setAutoReorder(!autoReorder)}
              className="flex items-center justify-between cursor-pointer py-1"
            >
              <div>
                <h4 className="text-sm font-bold text-gray-900">Purchase Auto-Reorders</h4>
                <p className="text-xs text-gray-400 leading-normal mt-0.5">Generate purchase draft drafts when safety margins are crossed.</p>
              </div>
              <button type="button">
                {autoReorder ? (
                  <ToggleRight className="h-9 w-9 stroke-1 text-orange-600 fill-orange-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9 stroke-1 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <Shield className="h-4.5 w-4.5" />
            Integrations & Security
          </h3>

          <div
            onClick={() => setApiTracking(!apiTracking)}
            className="flex items-center justify-between cursor-pointer py-1"
          >
            <div>
              <h4 className="text-sm font-bold text-gray-900">Enable Webhook Audit Notifications</h4>
              <p className="text-xs text-gray-400 leading-normal mt-0.5">Post logs automatically to external developer systems.</p>
            </div>
            <button type="button">
              {apiTracking ? (
                <ToggleRight className="h-9 w-9 stroke-1 text-orange-600 fill-orange-500" />
              ) : (
                <ToggleLeft className="h-9 w-9 stroke-1 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button className="flex items-center gap-2 rounded-2xl bg-orange-500 py-3.5 px-6 font-semibold text-white shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all cursor-pointer">
            <Save className="h-4.5 w-4.5" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
