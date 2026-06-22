"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useOnboarding } from "@/context/OnboardingContext";
import { api } from "@/utils/api";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().optional().refine((val) => {
    if (val !== undefined && val !== "") {
      return /^\d{6}$/.test(val);
    }
    return true;
  }, "OTP must be exactly 6 digits"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
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
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
  });

  const handleGenerateOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid) return;

    setIsOtpGenerating(true);
    try {
      const email = getValues("email");
      const res = await api.post("/auth/otp/generate", { email });
      const testOtp = res.testOtp || "123456";
      alert(`OTP code generated: ${testOtp} (Use default: 123456)`);
      setShowOtpField(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate OTP.");
    } finally {
      setIsOtpGenerating(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      if (!data.otp) {
        alert("You need to varify through the otp first !!!");
        return;
      }

      const payload: any = {
        email: data.email,
        password: data.password,
        otp: data.otp
      };
      if (!data.otp) {
        alert("You need to varify through the otp first !!!")
      }
      const response = await api.post("/auth/login", payload);
      if (response && response.token) {
        authLogin(response.token, response.user);
        if (response.user.tenantId) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      alert(err.message || "Invalid credentials or login failed.");
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
          <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your inventory, warehouses and business dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Generate OTP */}
          {!showOtpField && (
            <Button
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
            <Input
              id="otp"
              label="Enter OTP"
              placeholder="123456"
              error={errors.otp?.message}
              icon={<ShieldCheck className="h-4 w-4" />}
              {...register("otp")}
            />
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
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full py-3"
          >
            Sign In
          </Button>

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
