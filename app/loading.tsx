import React from "react";
import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50/20">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm font-semibold text-slate-500 animate-pulse">
          Loading application...
        </p>
      </div>
    </div>
  );
}
