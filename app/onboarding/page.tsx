"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import OnboardingStepper from "./components/OnboardingStepper";
import CompanyInfo from "./components/CompanyInfo";
import Subscription from "./components/Subscription";
import Sites from "./components/Sites";
import Locations from "./components/Locations";
import Categories from "./components/Categories";
import AssetFields from "./components/AssetFields";
import Events from "./components/Events";
import { CheckCircle2, ChevronRight, LayoutDashboard, Settings } from "lucide-react";
 import Link from "next/link";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const [formData, setFormData] = useState({
    companyInfo: {
      companyName: "",
      industry: "",
      orgSize: "1-10",
      email: "",
      phone: "",
      address: "",
    },
    subscription: {
      plan: "professional",
      billing: "monthly" as "monthly" | "yearly",
    },
    sites: [
      { id: "1", name: "Primary Warehouse", type: "warehouse", address: "HQ Site" },
    ],
    locations: [
      { id: "1", siteId: "1", name: "Aisle A, Bin 1", description: "General Storage" },
    ],
    categories: ["Electronics & Devices", "Office Supplies", "Tools & Equipment"],
    assetFields: ["serial_number", "barcode", "purchase_price"],
    events: ["check_in", "check_out", "transfer", "audit"],
  });

  const handleUpdate = (section: keyof typeof formData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleRawUpdate = (section: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsCompleted(true);
  };

  // Render the current component
  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyInfo
            data={formData.companyInfo}
            onChange={(field, val) => handleUpdate("companyInfo", field, val)}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Subscription
            data={formData.subscription}
            onChange={(field, val) => handleUpdate("subscription", field, val)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Sites
            data={{ sites: formData.sites }}
            onChange={(field, val) => handleRawUpdate("sites", val)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Locations
            data={{ sites: formData.sites, locations: formData.locations }}
            onChange={(field, val) => handleRawUpdate("locations", val)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <Categories
            data={{ categories: formData.categories }}
            onChange={(field, val) => handleRawUpdate("categories", val)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <AssetFields
            data={{ assetFields: formData.assetFields }}
            onChange={(field, val) => handleRawUpdate("assetFields", val)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 7:
        return (
          <Events
            data={{ events: formData.events }}
            onChange={(field, val) => handleRawUpdate("events", val)}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-orange-50/20">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="rounded-3xl border border-orange-100 bg-white p-12 shadow-2xl shadow-orange-100"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CheckCircle2 className="h-16 w-16" />
            </div>

            <h1 className="text-3xl font-black text-gray-950">Setup Complete!</h1>
            <p className="mt-4 text-gray-500">
              Your organization <span className="font-semibold text-orange-600">{formData.companyInfo.companyName || "Your Company"}</span> is now configured and ready.
            </p>

            {/* Summary */}
            <div className="mt-8 rounded-2xl bg-orange-50/50 p-6 text-left border border-orange-50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-4 flex items-center gap-1.5">
                <Settings className="h-4 w-4" />
                Setup Summary
              </h3>
              <div className="grid gap-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Industry:</span>
                  <span>{formData.companyInfo.industry || "Not Specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Subscription Tier:</span>
                  <span className="capitalize">{formData.subscription.plan} ({formData.subscription.billing})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sites Configured:</span>
                  <span>{formData.sites.length} site(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Storage Locations:</span>
                  <span>{formData.locations.length} location(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Categories:</span>
                  <span>{formData.categories.length} active</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Enabled Trackers:</span>
                  <span>{formData.assetFields.length} fields</span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 px-8 font-semibold text-white shadow-lg shadow-orange-100 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                Go to Dashboard
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50/20 pb-20">
      <Header />
      <OnboardingStepper currentStep={currentStep} onStepClick={(stepId) => setCurrentStep(stepId)} />

      <main className="mx-auto max-w-7xl px-4 mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 15, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -15, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepComponent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
