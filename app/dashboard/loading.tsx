import React from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50/50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm font-semibold text-slate-500 animate-pulse font-sans">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}
