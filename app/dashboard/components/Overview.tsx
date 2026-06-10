"use client";

import React, { useState } from "react";
import {
  Boxes,
  TrendingUp,
  AlertTriangle,
  MapPin,
  DollarSign,
  Plus,
  ArrowRightLeft,
  ClipboardCheck,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  FileText,
} from "lucide-react";

// Mock Stats Data
const STATS = [
  {
    title: "Total Assets / Items",
    value: "1,248",
    change: "+12.5%",
    changeType: "up",
    timeframe: "from last month",
    icon: Boxes,
    color: "bg-blue-500",
  },
  {
    title: "Low Stock Items",
    value: "14",
    change: "3 items resolved",
    changeType: "neutral",
    timeframe: "since yesterday",
    icon: AlertTriangle,
    color: "bg-red-500",
    alert: true,
  },
  {
    title: "Active Locations",
    value: "18 Bins / 2 Sites",
    change: "+1 site",
    changeType: "up",
    timeframe: "this quarter",
    icon: MapPin,
    color: "bg-emerald-500",
  },
  {
    title: "Total Inventory Value",
    value: "$142,850",
    change: "-2.4%",
    changeType: "down",
    timeframe: "from last month",
    icon: DollarSign,
    color: "bg-orange-500",
  },
];

// Mock Chart Data
const CHART_DATA = [
  { month: "Jan", checkIn: 65, checkOut: 40 },
  { month: "Feb", checkIn: 80, checkOut: 55 },
  { month: "Mar", checkIn: 72, checkOut: 60 },
  { month: "Apr", checkIn: 95, checkOut: 85 },
  { month: "May", checkIn: 110, checkOut: 70 },
  { month: "Jun", checkIn: 130, checkOut: 90 },
];

// Mock Recent Activities
const ACTIVITIES = [
  {
    id: 1,
    type: "transfer",
    user: "Shubh Verma",
    action: "Transferred 15x Monitor Mounts",
    details: "from HQ Storefront to Main Warehouse",
    time: "12 min ago",
    icon: ArrowRightLeft,
    iconColor: "text-blue-500 bg-blue-50",
  },
  {
    id: 2,
    type: "check_in",
    user: "John Doe",
    action: "Checked in 250x USB-C Cables",
    details: "to Aisle C, Shelf 2",
    time: "1 hr ago",
    icon: ArrowDownLeft,
    iconColor: "text-emerald-500 bg-emerald-50",
  },
  {
    id: 3,
    type: "check_out",
    user: "Sarah Smith",
    action: "Checked out 4x Pro Laptops",
    details: "assigned to Marketing Team",
    time: "3 hrs ago",
    icon: ArrowUpRight,
    iconColor: "text-red-500 bg-red-50",
  },
  {
    id: 4,
    type: "audit",
    user: "System Audit",
    action: "Reconciled Electronics Category",
    details: "Found discrepancy: +2 iPad units",
    time: "1 day ago",
    icon: ClipboardCheck,
    iconColor: "text-orange-500 bg-orange-50",
  },
];

interface OverviewProps {
  onTabChange?: (tab: string) => void;
}

export default function Overview({ onTabChange }: OverviewProps) {
  const [selectedChartType, setSelectedChartType] = useState<"all" | "in" | "out">("all");

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">Here is a summary of your inventory status.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onTabChange?.("inventory")}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
          <button
            onClick={() => onTabChange?.("activities")}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Transfer Stock
          </button>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={i}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-400">{stat.title}</span>
                <div className={`rounded-xl p-2.5 text-white ${stat.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-950">{stat.value}</h3>
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-bold
                      ${
                        stat.changeType === "up"
                          ? "bg-emerald-50 text-emerald-600"
                          : stat.changeType === "down"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                  >
                    {stat.changeType === "up" && <TrendingUp className="h-3 w-3" />}
                    {stat.changeType === "down" && <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </span>
                  <span className="text-gray-400 font-medium">{stat.timeframe}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Feed Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Mock Stock Activity Chart Panel */}
        <div className="xl:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Stock Movements</h3>
                <p className="text-xs text-gray-400 font-medium">Monthly comparison of check-ins vs check-outs</p>
              </div>

              {/* Chart Filters */}
              <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 p-1">
                {(["all", "in", "out"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedChartType(type)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition-all
                      ${
                        selectedChartType === type
                          ? "bg-white text-gray-950 shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-64 flex items-end justify-between px-2 pt-4 relative">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-gray-100 pb-8 text-3xs font-semibold text-gray-300">
                <div className="border-t border-dashed border-gray-100 w-full pt-1">150</div>
                <div className="border-t border-dashed border-gray-100 w-full pt-1">100</div>
                <div className="border-t border-dashed border-gray-100 w-full pt-1">50</div>
                <div className="w-full">0</div>
              </div>

              {/* Columns */}
              <div className="w-full h-full flex items-end justify-between z-10 pb-8">
                {CHART_DATA.map((item) => (
                  <div key={item.month} className="flex flex-col items-center flex-1 gap-2">
                    <div className="flex items-end gap-1.5 sm:gap-2.5">
                      {/* Check In Bar */}
                      {(selectedChartType === "all" || selectedChartType === "in") && (
                        <div
                          style={{ height: `${(item.checkIn / 150) * 100}%` }}
                          className="w-3 sm:w-4.5 rounded-t-md bg-orange-500 hover:bg-orange-600 transition-all relative group"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-3xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            +{item.checkIn} in
                          </div>
                        </div>
                      )}

                      {/* Check Out Bar */}
                      {(selectedChartType === "all" || selectedChartType === "out") && (
                        <div
                          style={{ height: `${(item.checkOut / 150) * 100}%` }}
                          className="w-3 sm:w-4.5 rounded-t-md bg-slate-300 hover:bg-slate-400 transition-all relative group"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-3xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            -{item.checkOut} out
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-2xs font-bold text-gray-400">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-6 border-t border-gray-50 pt-4 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-orange-500" />
              <span>Items Checked-In</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-slate-300" />
              <span>Items Checked-Out</span>
            </div>
          </div>
        </div>

        {/* Recent Activities Feed Panel */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-gray-400" />
                <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
              </div>
              <button
                onClick={() => onTabChange?.("activities")}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5 cursor-pointer"
              >
                View All
                <FileText className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* List Feed */}
            <div className="divide-y divide-gray-50">
              {ACTIVITIES.map((activity) => {
                const ActivityIcon = activity.icon;
                return (
                  <div key={activity.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex gap-3.5">
                      <div className={`rounded-xl p-2 h-9 w-9 shrink-0 flex items-center justify-center ${activity.iconColor}`}>
                        <ActivityIcon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-gray-900 truncate">{activity.action}</p>
                          <span className="text-3xs text-gray-400 whitespace-nowrap shrink-0">{activity.time}</span>
                        </div>
                        <p className="text-2xs text-gray-400 font-medium truncate mt-0.5">{activity.details}</p>
                        <p className="text-3xs text-gray-500 mt-1 font-semibold">User: {activity.user}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-50 pt-4 text-center">
            <span className="text-[11px] font-medium text-gray-400">
              All events logged in UTC timezone
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
