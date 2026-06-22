import Link from "next/link";
import { Boxes } from "lucide-react";

export default function OnboardingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-orange-50/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg">
            <Boxes className="h-5 w-5 text-white" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 md:text-xl">
            Stock & Warehouse
          </h2>
        </Link>

        {/* Onboarding Badge */}
        <div className="hidden sm:flex">
          <div className="rounded-full border border-gray-200 bg-gray-50 px-8 py-3 shadow-sm">
            <h1 className="text-sm font-semibold text-gray-700 md:text-base">
              Complete Your Onboarding
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
