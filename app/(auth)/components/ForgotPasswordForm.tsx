"use client";

import { useState } from "react";
import {
  Mail,
  ShieldCheck,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerateOtp = () => {
    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    // Call Generate OTP API
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (!formData.otp.trim()) {
      alert("Please enter OTP.");
      return;
    }

    // Call Verify OTP API
    setStep(3);
  };

  const handleChangePassword = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    // Call Change Password API
    console.log(formData);
  };

  return (
    <div className="w-full max-w-md">
      <div
        className="
          rounded-[28px]
          border border-orange-100
          bg-white
          p-6 lg:p-7
          shadow-[0_12px_40px_rgba(255,90,31,0.06)]
        "
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Reset your password securely.
          </p>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="space-y-4"
        >
          {/* EMAIL STEP */}
          {step >= 1 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={step > 1}
                  className="
                    w-full
                    rounded-2xl
                    border border-slate-200
                    py-2.5 pl-11 pr-4
                    text-sm
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[#FF5A1F]
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />
              </div>
            </div>
          )}

          {/* GENERATE OTP BUTTON */}
          {step === 1 && (
            <button
              type="button"
              onClick={handleGenerateOtp}
              className="
                w-full
                rounded-2xl
                border
                border-[#FF5A1F]
                py-2.5
                font-semibold
                text-[#FF5A1F]
                transition-all
                hover:bg-[#FFF4EE]
              "
            >
              Generate OTP
            </button>
          )}

          {/* OTP STEP */}
          {step >= 2 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Enter OTP
              </label>

              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  disabled={step > 2}
                  className="
                    w-full
                    rounded-2xl
                    border border-slate-200
                    py-2.5 pl-11 pr-4
                    text-sm
                    outline-none
                    transition-all
                    duration-300
                    focus:border-[#FF5A1F]
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />
              </div>
            </div>
          )}

          {/* VERIFY OTP BUTTON */}
          {step === 2 && (
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="
                w-full
                rounded-2xl
                bg-[#FF5A1F]
                py-3
                font-semibold
                text-white
                shadow-lg
                shadow-orange-100
                transition-all
                duration-300
                hover:bg-[#FF6B35]
              "
            >
              Verify OTP
            </button>
          )}

          {/* PASSWORD STEP */}
          {step === 3 && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    name="newPassword"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-2xl
                      border border-slate-200
                      py-2.5 pl-11 pr-4
                      text-sm
                      outline-none
                      transition-all
                      duration-300
                      focus:border-[#FF5A1F]
                      focus:ring-4
                      focus:ring-orange-100
                    "
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-2xl
                      border border-slate-200
                      py-2.5 pl-11 pr-4
                      text-sm
                      outline-none
                      transition-all
                      duration-300
                      focus:border-[#FF5A1F]
                      focus:ring-4
                      focus:ring-orange-100
                    "
                  />
                </div>
              </div>

              <button
                type="submit"
                className="
                  w-full
                  rounded-2xl
                  bg-[#FF5A1F]
                  py-3
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-orange-100
                  transition-all
                  duration-300
                  hover:bg-[#FF6B35]
                "
              >
                Change Password
              </button>

            </>
          )}
        </form>
        {/* Login Link */}
        <p className="pt-2 text-center text-sm text-slate-500">
          You know Password?{" "}
          <a
            href="/signin"
            className="font-semibold text-[#FF5A1F] hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}