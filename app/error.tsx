"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or error reporter
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50/20 px-6 py-24 text-center">
      <div className="mx-auto max-w-md rounded-3xl border border-orange-100 bg-white p-10 shadow-2xl shadow-orange-100">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle className="h-10 w-10" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-slate-900">
          Something went wrong!
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          An unexpected error occurred while loading this page. Let's try reloading or heading back.
        </p>

        {/* Debug info (optional/development) */}
        {error.message && (
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Error Details
            </span>
            <p className="mt-1 font-mono text-xs text-slate-600 break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>

          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
