"use client";

import React, { useState } from "react";
import { Search, ArrowUpDown, ArrowRightLeft, ArrowDownLeft, ArrowUpRight, ClipboardCheck, Filter } from "lucide-react";

interface Activity {
  id: number;
  type: "transfer" | "check_in" | "check_out" | "audit";
  user: string;
  action: string;
  details: string;
  time: string;
  date: string;
  status: "Completed" | "Pending" | "Flagged";
}

const ACTIVITIES: Activity[] = [
  {
    id: 1,
    type: "transfer",
    user: "Shubh Verma",
    action: "Transferred 15x Monitor Mounts",
    details: "from HQ Storefront to Primary Warehouse",
    time: "12 min ago",
    date: "2026-06-09",
    status: "Completed",
  },
  {
    id: 2,
    type: "check_in",
    user: "John Doe",
    action: "Checked in 250x USB-C Cables",
    details: "to Aisle C, Shelf 2",
    time: "1 hr ago",
    date: "2026-06-09",
    status: "Completed",
  },
  {
    id: 3,
    type: "check_out",
    user: "Sarah Smith",
    action: "Checked out 4x Pro Laptops",
    details: "assigned to Marketing Team",
    time: "3 hrs ago",
    date: "2026-06-09",
    status: "Completed",
  },
  {
    id: 4,
    type: "audit",
    user: "System Audit",
    action: "Reconciled Electronics Category",
    details: "Found discrepancy: +2 iPad units",
    time: "1 day ago",
    date: "2026-06-08",
    status: "Flagged",
  },
  {
    id: 5,
    type: "check_in",
    user: "John Doe",
    action: "Received 10x Office Chairs",
    details: "supplier: 'Comfort Ltd'",
    time: "2 days ago",
    date: "2026-06-07",
    status: "Completed",
  },
  {
    id: 6,
    type: "check_out",
    user: "Admin",
    action: "Disposed 2x Defective Monitors",
    details: "Written off due to screen damage",
    time: "3 days ago",
    date: "2026-06-06",
    status: "Completed",
  },
];

export default function ActivitiesTab() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = ACTIVITIES.filter((act) => {
    const matchesSearch =
      act.action.toLowerCase().includes(search.toLowerCase()) ||
      act.user.toLowerCase().includes(search.toLowerCase()) ||
      act.details.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || act.type === filterType;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "transfer":
        return ArrowRightLeft;
      case "check_in":
        return ArrowDownLeft;
      case "check_out":
        return ArrowUpRight;
      default:
        return ClipboardCheck;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "transfer":
        return "text-blue-600 bg-blue-50";
      case "check_in":
        return "text-emerald-600 bg-emerald-50";
      case "check_out":
        return "text-red-600 bg-red-50";
      default:
        return "text-orange-600 bg-orange-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Activity Audit Logs</h1>
        <p className="text-sm text-gray-500 font-medium">Verify historical inventory events, checks, and transfers.</p>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events, actions or users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500/50 focus:outline-none border focus:ring-4 focus:ring-orange-500/5 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
            <Filter className="h-4 w-4" />
            Type
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-orange-500 focus:outline-none border focus:ring-4 focus:ring-orange-500/5 transition-all"
          >
            <option value="all">All Events</option>
            <option value="check_in">Check-Ins</option>
            <option value="check_out">Check-Outs</option>
            <option value="transfer">Transfers</option>
            <option value="audit">Audits</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm text-gray-600">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="pb-4 pt-2 font-semibold">Event</th>
              <th className="pb-4 pt-2 font-semibold">Action Detail</th>
              <th className="pb-4 pt-2 font-semibold">Performed By</th>
              <th className="pb-4 pt-2 font-semibold">Date & Time</th>
              <th className="pb-4 pt-2 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length > 0 ? (
              filtered.map((act) => {
                const Icon = getIcon(act.type);
                const badge = getBadgeColor(act.type);
                return (
                  <tr key={act.id} className="group hover:bg-gray-50/30 transition-colors">
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-bold uppercase ${badge}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {act.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4">
                      <div>
                        <span className="font-bold text-gray-950 block">{act.action}</span>
                        <span className="text-2xs text-gray-400 font-medium mt-0.5 block">{act.details}</span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-gray-700 text-xs">{act.user}</td>
                    <td className="py-4">
                      <div>
                        <span className="font-bold text-gray-950 text-xs block">{act.date}</span>
                        <span className="text-3xs text-gray-400 font-semibold mt-0.5 block">{act.time}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex rounded-md px-1.5 py-0.5 text-3xs font-bold uppercase
                        ${act.status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                  No activity logs matched your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
