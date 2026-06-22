"use client";

import { steps } from "@/utils/interface";
import { Check } from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";

export default function OnboardingStepper() {
  const { currentStep, setStep } = useOnboarding();

  return (
    <div className="border-b border-orange-100 bg-orange-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">
          Welcome to Stock & Warehouse
        </h1>

        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;

              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setStep(step.id)}
                    className="flex flex-col items-center text-left focus:outline-none transition-transform duration-200 cursor-pointer hover:scale-105"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300
                        ${
                          isCompleted
                            ? "border-orange-500 bg-orange-500 text-white"
                            : isActive
                            ? "border-orange-500 bg-white text-orange-500 shadow-lg"
                            : "border-gray-300 bg-white text-gray-400"
                        }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>

                    <span
                      className={`mt-3 text-sm font-semibold whitespace-nowrap
                        ${
                          isActive
                            ? "text-orange-500"
                            : isCompleted
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                    >
                      {step.title}
                    </span>
                  </button>

                  {index !== steps.length - 1 && (
                    <div
                      className={`mx-4 mb-8 h-[2px] w-16 md:w-24
                        ${
                          step.id < currentStep
                            ? "bg-orange-500"
                            : "bg-gray-300"
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
