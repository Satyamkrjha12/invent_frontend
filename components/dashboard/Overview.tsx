"use client";

import React, { useState, useEffect } from "react";
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
import { useOnboarding } from "@/context/OnboardingContext";
import { api } from "@/utils/api";
import { Spinner } from "@/components/ui/Spinner";

// Fallback Mock Chart Data
const MOCK_CHART_DATA = [
  { month: "Jan", count: 65 },
  { month: "Feb", count: 80 },
  { month: "Mar", count: 72 },
  { month: "Apr", count: 95 },
  { month: "May", count: 110 },
  { month: "Jun", count: 130 },
];

// Mock Recent Activities
const MOCK_ACTIVITIES = [
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
  const { sites, locations } = useOnboarding();
  const [kpis, setKpis] = useState<any>({ users: 0, items: 0, inventoryValue: 0, recentActivities: 0 });
  const [chartData, setChartData] = useState<any>({ labels: [], data: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOverviewData() {
      try {
        setIsLoading(true);
        const res = await api.get("/dashboard");
        setKpis(res.kpis || { users: 0, items: 0, inventoryValue: 0, recentActivities: 0 });
        setChartData(res.charts || { labels: [], data: [] });
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOverviewData();
  }, []);

  const sitesCount = sites.length || 0;
  const locationsCount = locations.length || 0;

  const stats = [
    {
      title: "Unique Items",
      value: kpis.items.toString(),
      change: "+12.5%",
      changeType: "up",
      timeframe: "from last month",
      icon: Boxes,
      color: "bg-blue-500",
    },
    {
      title: "Recent Alerts",
      value: kpis.recentActivities.toString(),
      change: "Active events",
      changeType: "neutral",
      timeframe: "in last 7 days",
      icon: AlertTriangle,
      color: "bg-red-500",
      alert: kpis.recentActivities > 0,
    },
    {
      title: "Active Locations",
      value: `${locationsCount} Bins / ${sitesCount} Site${sitesCount !== 1 ? "s" : ""}`,
      change: "Configured",
      changeType: "up",
      timeframe: "on setup",
      icon: MapPin,
      color: "bg-emerald-500",
    },
    {
      title: "Total Inventory Value",
      value: `$${(kpis.inventoryValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "Live Value",
      changeType: "up",
      timeframe: "current catalog",
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasChartData = chartData.labels && chartData.labels.length > 0;
  const maxChartVal = hasChartData ? Math.max(...chartData.data, 1) : 150;

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
            <Plus className="h-4.5 w-4.5" />
            Add Asset
          </button>
          <button
            onClick={() => onTabChange?.("sites")}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <MapPin className="h-4 w-4" />
            Manage Sites
          </button>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
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
        {/* Stock Activity Chart Panel */}
        <div className="xl:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">System Activity Logs</h3>
                <p className="text-xs text-gray-400 font-medium">Timeline count of check-ins, transfers and updates</p>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-64 flex items-end justify-between px-2 pt-4 relative">
              {/* Y-Axis Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-gray-100 pb-8 text-3xs font-semibold text-gray-300">
                <div className="border-t border-dashed border-gray-100 w-full pt-1">{maxChartVal}</div>
                <div className="border-t border-dashed border-gray-100 w-full pt-1">{Math.floor(maxChartVal * 0.66)}</div>
                <div className="border-t border-dashed border-gray-100 w-full pt-1">{Math.floor(maxChartVal * 0.33)}</div>
                <div className="w-full">0</div>
              </div>

              {/* Columns */}
              <div className="w-full h-full flex items-end justify-between z-10 pb-8">
                {hasChartData ? (
                  chartData.labels.map((label: string, idx: number) => {
                    const count = chartData.data[idx];
                    return (
                      <div key={label} className="flex flex-col items-center flex-1 gap-2">
                        <div
                          style={{ height: `${(count / maxChartVal) * 100}%` }}
                          className="w-4.5 sm:w-6 rounded-t-md bg-orange-500 hover:bg-orange-600 transition-all relative group"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-3xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            {count} event{count !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <span className="text-3xs font-bold text-gray-400 truncate max-w-[50px]">{label}</span>
                      </div>
                    );
                  })
                ) : (
                  MOCK_CHART_DATA.map((item) => (
                    <div key={item.month} className="flex flex-col items-center flex-1 gap-2">
                      <div
                        style={{ height: `${(item.count / 150) * 100}%` }}
                        className="w-4.5 sm:w-6 rounded-t-md bg-orange-500 hover:bg-orange-600 transition-all relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-0.5 text-3xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                          {item.count} events
                        </div>
                      </div>
                      <span className="text-2xs font-bold text-gray-400">{item.month}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-6 border-t border-gray-50 pt-4 text-xs font-semibold text-gray-500">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-md bg-orange-500" />
              <span>Database Operations Logs Count</span>
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
                onClick={() => onTabChange?.("inventory")} // Navigate to inventory or keep it simple
                className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5 cursor-pointer"
              >
                View Catalog
                <FileText className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* List Feed */}
            <div className="divide-y divide-gray-50">
              {MOCK_ACTIVITIES.map((activity) => {
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
