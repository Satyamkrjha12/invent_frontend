"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./components/Overview";
import Inventory from "./components/Inventory";
import SitesTab from "./components/SitesTab";
import ActivitiesTab from "./components/ActivitiesTab";
import Team from "./components/Team";
import SettingsTab from "./components/SettingsTab";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "inventory":
        return <Inventory />;
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
        <Header onMenuClick={() => setIsSidebarOpen(true)} activeTab={activeTab} />

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
