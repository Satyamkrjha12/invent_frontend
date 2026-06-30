"use client";

import React, { useState } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";
import { Button } from "@/components/ui/Button";

const PLAN_PRICES = {
  starter: { inr: 29, usd: 29 },
  professional: { inr: 79, usd: 79 },
  enterprise: { inr: 199, usd: 199 },
};

export default function PaymentGateway() {
  const { subscription, user, createRazorpayOrder, verifyRazorpayPayment, logout } = useOnboarding();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const plan = subscription.plan || "starter";
  const billing = subscription.billing || "monthly";
  const price = PLAN_PRICES[plan as keyof typeof PLAN_PRICES] || PLAN_PRICES.starter;
  const displayPrice = billing === "yearly" ? Math.floor(price.inr * 0.8) : price.inr;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      // 1. Create order ID via backend
      const order = await createRazorpayOrder(plan);

      // 2. Load script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // 3. Configure Razorpay checkout options
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "StockKeep Inventory Hub",
        description: `${plan.toUpperCase()} Plan Subscription (${billing})`,
        order_id: order.id,
        handler: async function (response: any) {
          setIsProcessing(true);
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });
          } catch (verifyErr: any) {
            setErrorMessage(verifyErr.message || "Payment verification failed. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#F97316", // Brand Orange color
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to initiate transaction.");
      setIsProcessing(false);
    }
  };

  // Direct mock bypass for offline testing or when Razorpay key is not configured
  const handleMockBypass = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    try {
      const order = await createRazorpayOrder(plan);
      // Call verify endpoint with mock data
      await verifyRazorpayPayment({
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
        razorpay_signature: "mock_signature_approved",
        plan,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Simulation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-orange-100 bg-white p-8 shadow-2xl shadow-orange-100/50">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
          <CreditCard className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Unlock your Dashboard</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Please complete your subscription payment to finalize onboarding setup.
        </p>
      </div>

      {/* Plan Summary Card */}
      <div className="mt-6 rounded-2xl bg-orange-50/50 p-5 border border-orange-100/40">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 capitalize">{plan} Plan</h4>
            <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{billing} billing</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-orange-600">₹{displayPrice}</span>
            <span className="text-xs text-slate-400 font-bold"> / {billing === "monthly" ? "mo" : "yr"}</span>
          </div>
        </div>

        <div className="mt-4 border-t border-orange-100/40 pt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Complete warehouse onboarding</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Dynamic inventory tracking</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Multi-user team permission controls</span>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-center text-xs font-semibold text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 space-y-3">
        <Button
          onClick={handlePayment}
          isLoading={isProcessing}
          className="w-full py-4 text-sm font-bold shadow-lg shadow-orange-500/10"
        >
          Pay with Razorpay
        </Button>

        {/* Demo simulator bypass */}
        <button
          type="button"
          onClick={handleMockBypass}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-orange-200 bg-orange-50/20 py-2.5 text-2xs font-bold text-orange-600 hover:bg-orange-50 active:scale-98 transition-all disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          Simulate Mock Test Payment
        </button>

        <button
          type="button"
          onClick={logout}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-semibold pt-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Sign out and edit credentials
        </button>
      </div>
    </div>
  );
}
