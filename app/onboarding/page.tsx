"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, LayoutDashboard, Settings } from "lucide-react";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingStepper from "@/components/onboarding/OnboardingStepper";
import { useOnboarding } from "@/context/OnboardingContext";
import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/Spinner";

function OnboardingStepLoader() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white p-12 shadow-xl shadow-orange-50/50 flex flex-col items-center justify-center min-h-[300px]">
      <Spinner size="lg" />
      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
        Loading step details...
      </p>
    </div>
  );
}

const CompanyInfo = dynamic(() => import("@/components/onboarding/CompanyInfo"), {
  loading: () => <OnboardingStepLoader />,
  ssr: false,
});

const Subscription = dynamic(() => import("@/components/onboarding/Subscription"), {
  loading: () => <OnboardingStepLoader />,
  ssr: false,
});

const Sites = dynamic(() => import("@/components/onboarding/Sites"), {
  loading: () => <OnboardingStepLoader />,
  ssr: false,
});

const Locations = dynamic(() => import("@/components/onboarding/Locations"), {
  loading: () => <OnboardingStepLoader />,
  ssr: false,
});

const Categories = dynamic(() => import("@/components/onboarding/Categories"), {
  loading: () => <OnboardingStepLoader />,
  ssr: false,
});

const AssetFields = dynamic(() => import("@/components/onboarding/AssetFields"), {
  loading: () => <OnboardingStepLoader />,
  ssr: false,
});

const Events = dynamic(() => import("@/components/onboarding/Events"), {
  loading: () => <OnboardingStepLoader />,
  ssr: false,
});

const PaymentGateway = dynamic(() => import("@/components/onboarding/PaymentGateway"), {
  loading: () => <OnboardingStepLoader />,
  ssr: false,
});

export default function OnboardingPage() {
  const {
    currentStep,
    isCompleted,
    companyInfo,
    subscription,
    sites,
    locations,
    categories,
    assetFields,
    user,
  } = useOnboarding();

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <CompanyInfo />;
      case 2:
        return <Subscription />;
      case 3:
        return <Sites />;
      case 4:
        return <Locations />;
      case 5:
        return <Categories />;
      case 6:
        return <AssetFields />;
      case 7:
        return <Events />;
      default:
        return null;
    }
  };

  if (isCompleted) {
    const isPaid = user?.paymentCompleted;

    return (
      <div className="min-h-screen bg-orange-50/20">
        <OnboardingHeader />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          {!isPaid ? (
            <PaymentGateway />
          ) : (
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
                Your organization{" "}
                <span className="font-semibold text-orange-600">
                  {companyInfo.companyName || "Your Company"}
                </span>{" "}
                is now configured and ready.
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
                    <span>{companyInfo.industry || "Not Specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subscription Tier:</span>
                    <span className="capitalize">
                      {subscription.plan} ({subscription.billing})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sites Configured:</span>
                    <span>{sites.length} site(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Storage Locations:</span>
                    <span>{locations.length} location(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Categories:</span>
                    <span>{categories.length} active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Enabled Trackers:</span>
                    <span>{assetFields.length} fields</span>
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
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50/20 pb-20">
      <OnboardingHeader />
      <OnboardingStepper />

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
