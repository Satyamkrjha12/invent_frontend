"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Boxes,
  LayoutDashboard,
  ClipboardList,
  Warehouse,
  History,
  Settings,
  Users,
  X,
  ChevronRight,
  LogOut,
  Tag,
} from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";
import { useInventoryStore } from "@/utils/store/useInventoryStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const NAV_ITEMS = [
  { id: "overview", name: "Overview", icon: LayoutDashboard },
  { id: "inventory", name: "Inventory", icon: ClipboardList, showBadge: true },
  { id: "add-category", name: "Add Category", icon: Tag },
  { id: "sites", name: "Sites & Bins", icon: Warehouse },
  { id: "activities", name: "Activity Logs", icon: History },
  { id: "team", name: "Team Members", icon: Users },
  { id: "settings", name: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  const { companyInfo, subscription, sites } = useOnboarding();
  const companyName = companyInfo.companyName || "Acme Warehouse";
  const plan = subscription.plan || "starter";
  const sitesCount = sites.length;
  const itemsCount = useInventoryStore((state) => state.items.length);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-slate-300">
      {/* Brand & Logo */}
      <div>
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-md shadow-orange-500/20">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">Stock & Warehouse</h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Inventory Hub</p>
            </div>
          </div>

          {/* Close button on Mobile */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 px-4 py-6">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const NavIcon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full text-left group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none
                  ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/15"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <NavIcon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} />
                  <span>{item.name}</span>
                </div>

                {item.showBadge && item.id === "inventory" && !isActive && (
                  <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400 font-bold group-hover:bg-slate-700">
                    {itemsCount}
                  </span>
                )}
                {isActive && <ChevronRight className="h-4 w-4 text-white/80" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Company Profile info at bottom */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-2xl bg-slate-800/40 p-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 font-bold text-sm uppercase">
            {companyName.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs font-bold text-white">{companyName}</h4>
            <p className="truncate text-[10px] text-slate-500 font-medium capitalize">
              {plan} • {sitesCount} Site{sitesCount !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/signin"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Always Visible on Large Screens) */}
      <aside className="fixed bottom-0 top-0 left-0 z-30 hidden w-64 border-r border-slate-800 bg-slate-900 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed bottom-0 top-0 left-0 z-50 w-72 bg-slate-900 shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
