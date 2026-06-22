"use client";

import React, { useState } from "react";
import { ArrowLeft, CheckCircle2, ToggleLeft, ToggleRight, ArrowDownLeft, ArrowUpRight, MoveHorizontal, ClipboardCheck, Wrench, Trash2 } from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";

const AVAILABLE_EVENTS = [
  {
    id: "check_in",
    name: "Check-in (Receive Stock)",
    description: "Logged when adding new items or stock batches to a storage site.",
    icon: ArrowDownLeft,
    critical: true,
  },
  {
    id: "check_out",
    name: "Check-out (Dispatch / Consume)",
    description: "Logs assignment of items to employees, sales orders, or projects.",
    icon: ArrowUpRight,
    critical: true,
  },
  {
    id: "transfer",
    name: "Internal Transfer",
    description: "Track movements of stock and assets between sites and storage bins.",
    icon: MoveHorizontal,
    critical: false,
  },
  {
    id: "audit",
    name: "Inventory Audits",
    description: "Reconcile physical stock counts with digital system counts.",
    icon: ClipboardCheck,
    critical: false,
  },
  {
    id: "maintenance",
    name: "Maintenance & Service",
    description: "Track service history, repairs, downtime, and vendor cost for assets.",
    icon: Wrench,
    critical: false,
  },
  {
    id: "disposal",
    name: "Disposal / Retracts",
    description: "Write-off damaged, lost, or retired items with justification logging.",
    icon: Trash2,
    critical: false,
  },
];

export default function Events() {
  const { events, setEvents, completeOnboarding, backStep } = useOnboarding();
  const [isFinishing, setIsFinishing] = useState(false);

  const toggleEvent = (eventId: string) => {
    const isEnabled = events.includes(eventId);
    let updated: string[];

    if (isEnabled) {
      updated = events.filter((e) => e !== eventId);
    } else {
      updated = [...events, eventId];
    }
    setEvents(updated);
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await completeOnboarding();
    } catch (err) {
      console.error(err);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-50/50">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Configure Event Logging</h2>
        <p className="mt-2 text-sm text-gray-500">
          Select which activity logs should be enabled for audit trails and notification alerts.
        </p>
      </div>

      <div className="space-y-4">
        {AVAILABLE_EVENTS.map((event) => {
          const isEnabled = events.includes(event.id);
          const IconComponent = event.icon;

          return (
            <div
              key={event.id}
              onClick={() => toggleEvent(event.id)}
              className={`flex items-center justify-between rounded-2xl border p-5 transition-all duration-300 cursor-pointer
                ${
                  isEnabled
                    ? "border-orange-500 bg-orange-50/30 shadow-sm shadow-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-xl p-2.5 mt-0.5 ${
                    isEnabled ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{event.name}</h4>
                    {event.critical && (
                      <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 uppercase">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              <div>
                {isEnabled ? (
                  <div className="text-orange-600 transition-colors">
                    <ToggleRight className="h-9 w-9 stroke-1 fill-orange-500" />
                  </div>
                ) : (
                  <div className="text-gray-300 transition-colors">
                    <ToggleLeft className="h-9 w-9 stroke-1" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-8 border-t border-gray-100 pt-6 flex justify-between">
        <button
          type="button"
          onClick={backStep}
          className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-gray-600 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          disabled={isFinishing}
          onClick={handleFinish}
          className={`inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-200 hover:from-orange-600 hover:to-orange-700 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer ${
            isFinishing ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isFinishing ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Finishing...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Finish Setup
            </>
          )}
        </button>
      </div>
    </div>
  );
}
