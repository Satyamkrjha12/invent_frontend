"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [showOtpField, setShowOtpField] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const router = useRouter();

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

  const handleRegister = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    console.log(formData);
    router.push("/onboarding")
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
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start managing inventory, warehouses
            and teams from one platform.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
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

          {/* Confirm Password */}
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
            Create Account
          </button>

          {/* Login Link */}
          <p className="pt-2 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-semibold text-[#FF5A1F] hover:underline"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}