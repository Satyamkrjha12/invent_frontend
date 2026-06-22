"use client";

import React from "react";
import { Check, ArrowLeft, ArrowRight, Zap, Star, ShieldCheck } from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    description: "Perfect for small businesses starting out.",
    priceMonthly: 29,
    priceYearly: 23, // 20% discount approx
    features: [
      "Up to 2 warehouses/sites",
      "Up to 1,000 items/assets",
      "Standard fields & categories",
      "Email & community support",
    ],
    color: "orange",
  },
  {
    id: "professional",
    name: "Professional",
    icon: Star,
    description: "Best for growing organizations with multiple sites.",
    priceMonthly: 79,
    priceYearly: 63,
    features: [
      "Unlimited warehouses/sites",
      "Up to 10,000 items/assets",
      "Custom fields & categories",
      "Advanced events & audits",
      "Priority 24/7 support",
    ],
    color: "orange",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: ShieldCheck,
    description: "For scaling operations needing custom rules & controls.",
    priceMonthly: 199,
    priceYearly: 159,
    features: [
      "Unlimited warehouses & items",
      "Dedicated account manager",
      "Custom integrations & API access",
      "SLA guarantee & custom events",
      "Tailored onboarding training",
    ],
    color: "slate",
  },
];

export default function Subscription() {
  const { subscription, updateSubscription, nextStep, backStep } = useOnboarding();

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-50/50">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose your Plan</h2>
        <p className="mt-2 text-sm text-gray-500">
          Select the option that best fits your inventory tracking scale.
        </p>

        {/* Monthly/Yearly Toggle */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${
              subscription.billing === "monthly"
                ? "text-gray-900"
                : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <button
            type="button"
            onClick={() =>
              updateSubscription({
                billing:
                  subscription.billing === "monthly" ? "yearly" : "monthly",
              })
            }
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-orange-200 transition-colors duration-200 ease-in-out focus:outline-none"
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-orange-600 shadow ring-0 transition duration-200 ease-in-out
                ${
                  subscription.billing === "yearly"
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              subscription.billing === "yearly"
                ? "text-gray-900"
                : "text-gray-400"
            }`}
          >
            Yearly{" "}
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isSelected = subscription.plan === plan.id;
          const PlanIcon = plan.icon;
          const price =
            subscription.billing === "monthly"
              ? plan.priceMonthly
              : plan.priceYearly;

          return (
            <div
              key={plan.id}
              onClick={() => updateSubscription({ plan: plan.id })}
              className={`relative flex flex-col rounded-3xl border p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer
                ${
                  isSelected
                    ? "border-orange-500 bg-white ring-4 ring-orange-500/10 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-4 py-1 text-xs font-bold text-white shadow-md uppercase tracking-wider">
                  Popular
                </span>
              )}

              <div className="mb-5">
                <div
                  className={`inline-flex rounded-2xl p-3 mb-4 ${
                    isSelected
                      ? "bg-orange-50 text-orange-600"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <PlanIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed min-h-[32px]">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${price}
                </span>
                <span className="text-sm font-semibold text-gray-400">
                  {" "}
                  / month
                </span>
                {subscription.billing === "yearly" && (
                  <p className="mt-1 text-xs text-orange-600 font-medium">
                    Billed annually
                  </p>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        isSelected ? "text-orange-500 font-bold" : "text-gray-400"
                      }`}
                    />
                    <span className="text-gray-600 leading-normal">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`w-full py-3 px-4 rounded-2xl font-semibold text-sm transition-all duration-200
                  ${
                    isSelected
                      ? "bg-orange-600 text-white shadow-md shadow-orange-100 hover:bg-orange-700"
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {isSelected ? "Plan Selected" : "Choose Plan"}
              </button>
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
          onClick={nextStep}
          className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-white bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Next Step
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
