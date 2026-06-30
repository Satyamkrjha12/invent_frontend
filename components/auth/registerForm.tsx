"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "@/context/OnboardingContext";
import { api } from "@/utils/api";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    otp: z.string().optional().refine((val) => {
      if (val !== undefined && val !== "") {
        return /^\d{6}$/.test(val);
      }
      return true;
    }, "OTP must be exactly 6 digits"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpGenerating, setIsOtpGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useOnboarding();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
  });

  const [otpStatus, setOtpStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleGenerateOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid) return;

    setIsOtpGenerating(true);
    setOtpStatus(null);
    try {
      const email = getValues("email");
      await api.post("/auth/otp/generate", { email });
      setOtpStatus({
        type: "success",
        message: "OTP sent! Please check your registered email address.",
      });
      setShowOtpField(true);
    } catch (err: any) {
      console.error(err);
      setOtpStatus({
        type: "error",
        message: err.message || "Failed to generate OTP.",
      });
    } finally {
      setIsOtpGenerating(false);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setOtpStatus(null);
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        otp: data.otp,
      });
      if (response && response.token) {
        authLogin(response.token, response.refreshToken || null, response.user);
        router.push("/onboarding");
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setOtpStatus({
        type: "error",
        message: err.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Start managing inventory, warehouses and teams from one platform.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            icon={<User className="h-4 w-4" />}
            {...register("name")}
          />

          {/* Email */}
          <Input
            id="email"
            label="Email Address"
            placeholder="john@example.com"
            error={errors.email?.message}
            icon={<Mail className="h-4 w-4" />}
            {...register("email")}
          />

          {/* Password */}
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            icon={<Lock className="h-4 w-4" />}
            {...register("password")}
          />

          {/* Confirm Password */}
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            icon={<Lock className="h-4 w-4" />}
            {...register("confirmPassword")}
          />

          {/* Status Message */}
          {otpStatus && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${otpStatus.type === "success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
              {otpStatus.message}
            </div>
          )}

          {/* Generate OTP */}
          {!showOtpField && (
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateOtp}
              isLoading={isOtpGenerating}
              className="w-full"
            >
              Generate OTP
            </Button>
          )}

          {/* OTP Field */}
          {showOtpField && (
            <div className="space-y-1.5">
              <Input
                id="otp"
                label="Enter OTP"
                placeholder="123456"
                error={errors.otp?.message}
                icon={<ShieldCheck className="h-4 w-4" />}
                {...register("otp")}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateOtp}
                  disabled={isOtpGenerating}
                  className="text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline disabled:opacity-50 transition-colors"
                >
                  {isOtpGenerating ? "Resending..." : "Resend OTP Code"}
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full py-3"
          >
            Create Account
          </Button>

          {/* Login Link */}
          <p className="pt-2 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-[#FF5A1F] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
