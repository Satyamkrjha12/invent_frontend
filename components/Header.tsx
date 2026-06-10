"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Setup Flow", href: "#setup" },
  { name: "Reviews", href: "#reviews" },
];

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ["home", "features", "setup", "reviews"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-orange-50 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg">
            <Boxes className="h-5 w-5 text-white" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 md:text-xl">
            Stock & Warehouse
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <div className="flex items-center gap-10 rounded-full border border-gray-200 bg-gray-50 px-8 py-3">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-orange-500 font-bold"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-5">
          <Link
            href="/signin"
            className="text-sm font-medium text-gray-700 transition hover:text-orange-500"
          >
            Sign In
          </Link>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden rounded-xl p-2 hover:bg-gray-100"
        >
          {mobileMenu ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-gray-200 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-5">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className={`rounded-xl px-4 py-3 font-semibold transition-colors duration-200 ${
                      isActive
                        ? "bg-orange-50 text-orange-500 font-bold"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <div className="mt-4 border-t border-gray-100 pt-4">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenu(false)}
                  className="block rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setMobileMenu(false)}
                  className="mt-3 flex justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 font-semibold text-white shadow-lg"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}