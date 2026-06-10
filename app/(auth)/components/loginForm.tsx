"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [showOtpField, setShowOtpField] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
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
      alert("Please enter your email first.");
      return;
    }

    // Call OTP API
    setShowOtpField(true);
  };

  const handleLogin = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    console.log(formData);

    // Call Login API
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
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your inventory,
            warehouses and business dashboard.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          {/* Email */}
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
                className="
                  w-full
                  rounded-2xl
                  border border-slate-200
                  py-2.5 pl-11 pr-4
                  text-sm
                  outline-none
                  transition-all duration-300
                  focus:border-[#FF5A1F]
                  focus:ring-4 focus:ring-orange-100
                "
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="
                  w-full
                  rounded-2xl
                  border border-slate-200
                  py-2.5 pl-11 pr-4
                  text-sm
                  outline-none
                  transition-all duration-300
                  focus:border-[#FF5A1F]
                  focus:ring-4 focus:ring-orange-100
                "
              />
            </div>
          </div>

          {/* Generate OTP */}
          <button
            type="button"
            onClick={handleGenerateOtp}
            className="
              w-full
              rounded-2xl
              border border-[#FF5A1F]
              py-2.5
              text-sm
              font-semibold
              text-[#FF5A1F]
              transition-all duration-300
              hover:bg-[#FFF4EE]
            "
          >
            Generate OTP
          </button>

          {/* OTP Field */}
          {showOtpField && (
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
                  className="
                    w-full
                    rounded-2xl
                    border border-slate-200
                    py-2.5 pl-11 pr-4
                    text-sm
                    outline-none
                    transition-all duration-300
                    focus:border-[#FF5A1F]
                    focus:ring-4 focus:ring-orange-100
                  "
                />
              </div>
            </div>
          )}

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgotpass"
              className="text-sm font-medium text-[#FF5A1F] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full
              rounded-2xl
              bg-[#FF5A1F]
              py-3
              font-semibold
              text-white
              shadow-lg shadow-orange-100
              transition-all duration-300
              hover:bg-[#FF6B35]
              hover:shadow-xl
            "
          >
            Sign In
          </button>

          {/* Register Link */}
          <p className="pt-2 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#FF5A1F] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}