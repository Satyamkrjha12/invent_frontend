"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/Spinner";
import { useOnboarding } from "@/context/OnboardingContext";

const Sidebar = dynamic(() => import("@/components/dashboard/Sidebar"), {
  ssr: false,
});

const DashboardHeader = dynamic(() => import("@/components/dashboard/DashboardHeader"), {
  ssr: false,
});

// Dynamically import heavy tab panels with a custom loading indicator
const Overview = dynamic(() => import("@/components/dashboard/Overview"), {
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
});

const Inventory = dynamic(() => import("@/components/dashboard/Inventory"), {
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
});

const SitesTab = dynamic(() => import("@/components/dashboard/SitesTab"), {
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
});

const ActivitiesTab = dynamic(() => import("@/components/dashboard/ActivitiesTab"), {
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
});

const Team = dynamic(() => import("@/components/dashboard/Team"), {
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
});

const SettingsTab = dynamic(() => import("@/components/dashboard/SettingsTab"), {
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
});

const AddAssetTab = dynamic(() => import("@/components/dashboard/AddAssetTab"), {
  loading: () => (
    <div className="py-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  ),
});

export default function DashboardPage() {
  const { user, isLoading } = useOnboarding();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin");
      } else if (!user.tenantId) {
        router.push("/onboarding");
      }
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || !user.tenantId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-sm font-semibold text-gray-500 animate-pulse">
            Configuring dashboard settings...
          </p>
        </div>
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "inventory":
        return <Inventory />;
      case "add-category":
        return <AddAssetTab />;
      case "sites":
        return <SitesTab />;
      case "activities":
        return <ActivitiesTab />;
      case "team":
        return <Team />;
      case "settings":
        return <SettingsTab />;
      default:
        return <Overview onTabChange={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="min-h-screen lg:pl-64 flex flex-col">
        {/* Sticky Header */}
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} activeTab={activeTab} />

        {/* Content Wrapper */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >
              {renderActiveComponent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
