"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-[#FFFAF7]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-12 text-center">

        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            New Multi-Warehouse Management
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-5xl text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-7xl"
        >
          The Inventory &
          <br />
          Warehouse System
          <br />
          <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
            Built To Scale.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl"
        >
          Manage warehouses, products, inventory, teams, suppliers,
          purchases and sales from one modern platform designed for
          Retail, Wholesale, Distribution and Manufacturing businesses.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/signup" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:scale-[1.02]">
            Start Onboarding Wizard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link href="/signin" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50">
            <Play className="h-4 w-4" />
            Live Interactive Demo
          </Link>
        </motion.div>

        {/* Trusted By */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
            Trusted By Growing Businesses
          </p>

          <div className="flex flex-wrap justify-center gap-12 text-lg font-semibold text-gray-300">
            <span>RetailPro</span>
            <span>SmartStock</span>
            <span>WareFlow</span>
            <span>SupplySync</span>
            <span>StockPilot</span>
            <span>InventoryX</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
