"use client";

import Link from "next/link";
import { Boxes } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
        relative overflow-hidden
        border-t border-orange-100
        bg-orange-50
        shadow-[0_-8px_30px_rgba(255,90,31,0.08)]
      "
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 shadow-md">
            <Boxes className="h-4 w-4 text-white" />
          </div>

          <span className="text-sm font-semibold text-slate-900">
            Stock & Warehouse
          </span>
        </Link>

        {/* Copyright */}
        <p className="text-xs text-slate-500">
          © 2026 Inventory Management SaaS. Crafted with precision.
        </p>
      </div>

      {/* Orange Glow Effects */}
      <div className="absolute left-0 top-0 h-full w-1/3 bg-orange-200/20 blur-3xl" />
      <div className="absolute right-0 top-0 h-full w-1/3 bg-orange-300/20 blur-3xl" />
    </footer>
  );
}