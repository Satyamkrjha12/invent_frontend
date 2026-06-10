"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Warehouse,
  Boxes,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Building2,
    title: "Organization Management",
    description:
      "Configure Retail, Wholesale, Distribution, or Manufacturing businesses with custom tax settings, currencies, and financial periods.",
  },
  {
    icon: Users,
    title: "Role-Based Team Access",
    description:
      "Invite managers, sales teams, warehouse operators, and purchase officers with secure permission controls.",
  },
  {
    icon: Warehouse,
    title: "Multi-Warehouse Network",
    description:
      "Manage multiple warehouses, branches, and storage locations from a single unified dashboard.",
  },
  {
    icon: Boxes,
    title: "Smart Product Categories",
    description:
      "Organize inventory into structured categories and import product data instantly using CSV uploads.",
  },
  {
    icon: Package,
    title: "Real-Time Stock Tracking",
    description:
      "Monitor stock levels, product movement, opening inventory, and warehouse availability in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Business Data",
    description:
      "Enterprise-grade protection for inventory records, warehouse data, transactions, and customer information.",
  },
];



export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <section
      id="features"
      className="bg-orange-50 py-32 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Powerful Features
          </span>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Built for modern
            <span className="block bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              warehouse operations
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Everything you need to manage inventory, warehouses,
            products, and teams from a single intelligent platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index: number) => {
            const Icon = feature.icon;
            const isActive = activeFeature === index;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{ y: -8 }}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
                className={`group cursor-pointer rounded-3xl border p-8 transition-all duration-300 ${isActive
                    ? "border-orange-300 bg-orange-50 shadow-xl ring-2 ring-orange-200"
                    : "border-gray-200 bg-white shadow-sm hover:shadow-xl"
                  }`}
              >
                {/* Icon */}
                <div
                  className={`mb-6 flex h-14  items-center justify-center rounded-2xl transition-all duration-300 ${isActive
                      ? "bg-orange-500 text-white"
                      : "bg-orange-50 text-orange-500 group-hover:bg-orange-100"
                    }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3
                  className={`mb-4 text-xl font-bold transition-colors ${isActive
                      ? "text-orange-600"
                      : "text-slate-900"
                    }`}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>

                {/* Active Indicator */}
                <div
                  className={`mt-6 h-1 rounded-full bg-orange-500 transition-all duration-300 ${isActive ? "w-full" : "w-0"
                    }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}