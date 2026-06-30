"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search, User, LogOut, Settings, Shield, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useOnboarding } from "@/context/OnboardingContext";
import { api } from "@/utils/api";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  activeTab: string;
}

export default function DashboardHeader({ onMenuClick, activeTab }: DashboardHeaderProps) {
  const { user, searchQuery, setSearchQuery } = useOnboarding();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real low-stock notifications from backend on mount
  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await api.get("/inventory");
        const lowStock = res.items?.filter((item: any) => item.status === "Low Stock") || [];
        const alerts = lowStock.map((item: any, idx: number) => ({
          id: idx + 1,
          title: "Low Stock Alert",
          desc: `${item.name} (${item.sku}) is below limit: only ${item.qty} left in ${item.site || "warehouse"}.`,
          time: "Just now",
          unread: true,
        }));
        setNotifications(alerts);
      } catch (e) {
        console.error("Failed to load notifications:", e);
      }
    }
    if (user?.tenantId) {
      loadAlerts();
    }
  }, [user?.tenantId]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getHeaderInfo = () => {
    switch (activeTab) {
      case "inventory":
        return { title: "Inventory Management", sub: "Monitor SKU quantities and stock levels" };
      case "sites":
        return { title: "Sites & Storage Bins", sub: "Coordinate warehouses and storage rooms" };
      case "activities":
        return { title: "Audit Logs", sub: "Verify historical database logs and transfers" };
      case "team":
        return { title: "Team Directory", sub: "Manage roles and system credentials" };
      case "settings":
        return { title: "Configuration Settings", sub: "Adjust inventory thresholds and triggers" };
      default:
        return { title: "Dashboard Overview", sub: "Manage warehouses and tracking" };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-md">
      
      {/* Left Area: Hamburger (Mobile) & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-gray-500 hover:bg-gray-50 active:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-lg font-bold text-gray-900">{headerInfo.title}</h2>
          <p className="text-xs font-semibold text-gray-400">{headerInfo.sub}</p>
        </div>
      </div>

      {/* Center Area: Search Bar */}
      <div className="hidden md:flex max-w-md w-80 items-center">
        <div className="relative w-full rounded-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search items, sites, or serials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500/50 focus:outline-none border focus:ring-4 focus:ring-orange-500/5 transition-all"
          />
        </div>
      </div>

      {/* Right Area: Search (Mobile Icon), Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Icon for Mobile */}
        <button className="rounded-xl p-2 text-gray-500 hover:bg-gray-50 md:hidden">
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <h4 className="text-sm font-bold text-gray-900">Notifications</h4>
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-2xs font-semibold text-orange-600">
                  {unreadCount} New
                </span>
              </div>
              <div className="space-y-3.5 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="flex flex-col gap-1 rounded-xl p-2 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${notif.unread ? "text-orange-600" : "text-gray-950"}`}>
                          {notif.title}
                        </span>
                        <span className="text-3xs text-gray-400">{notif.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-500">{notif.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs font-semibold text-gray-400">
                    No new alerts.
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 mt-3.5 pt-3 text-center">
                <button 
                  onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Popover */}
        <div className="relative font-sans" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-50 text-left transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white shadow-sm uppercase">
              {(user?.name || "U").slice(0, 1)}
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-bold text-gray-950 leading-tight">{user?.name || "User Profile"}</div>
              <div className="text-3xs font-semibold text-gray-400 capitalize">{user?.role || "Admin Owner"}</div>
            </div>
            <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-gray-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2.5 shadow-xl shadow-gray-100/50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="border-b border-gray-50 px-3 py-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Account</p>
                <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{user?.email || "user@example.com"}</p>
              </div>

              <div className="mt-2 space-y-1">
                <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-950 transition-colors">
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-950 transition-colors">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </button>
                <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-950 transition-colors">
                  <Shield className="h-4 w-4" />
                  Security
                </button>
              </div>

              <div className="border-t border-gray-100 mt-2.5 pt-2">
                <Link
                  href="/signin"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
