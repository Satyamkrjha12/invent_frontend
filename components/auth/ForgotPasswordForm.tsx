"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/utils/api";

const forgotPasswordSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    otp: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.otp !== undefined && data.otp !== "") {
      if (!/^\d{6}$/.test(data.otp)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "OTP must be exactly 6 digits",
          path: ["otp"],
        });
      }
    }
    if (data.newPassword !== undefined && data.newPassword !== "") {
      if (data.newPassword.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 6 characters",
          path: ["newPassword"],
        });
      }
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    }
  });

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleGenerateOtp = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid) return;

    setIsLoading(true);
    try {
      const email = getValues("email");
      const res = await api.post("/auth/otp/generate-reset", { email });
      const testOtp = res.testOtp || "123456";
      alert(`Reset OTP code generated: ${testOtp} (Use default: 123456)`);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate reset OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const isOtpValid = await trigger("otp");
    if (!isOtpValid) return;

    setIsLoading(true);
    try {
      const email = getValues("email");
      const otp = getValues("otp");
      await api.post("/auth/otp/verify-reset", { email, otp });
      setStep(3);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ForgotPasswordValues) => {
    const isPasswordValid = await trigger(["newPassword", "confirmPassword"]);
    if (!isPasswordValid) return;

    setIsLoading(true);
    try {
      await api.post("/auth/password/reset", {
        email: data.email,
        otp: data.otp,
        password: data.newPassword,
      });
      alert("Password successfully reset! Redirecting to Sign In...");
      router.push("/signin");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
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
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-slate-900">Forgot Password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Reset your password securely.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* EMAIL STEP */}
          {step >= 1 && (
            <Input
              id="email"
              label="Email Address"
              placeholder="john@example.com"
              disabled={step > 1}
              error={errors.email?.message}
              icon={<Mail className="h-4 w-4" />}
              {...register("email")}
            />
          )}

          {/* GENERATE OTP BUTTON */}
          {step === 1 && (
            <Button
              variant="outline"
              onClick={handleGenerateOtp}
              isLoading={isLoading}
              className="w-full"
            >
              Generate OTP
            </Button>
          )}

          {/* OTP STEP */}
          {step >= 2 && (
            <Input
              id="otp"
              label="Enter OTP"
              placeholder="123456"
              disabled={step > 2}
              error={errors.otp?.message}
              icon={<ShieldCheck className="h-4 w-4" />}
              {...register("otp")}
            />
          )}

          {/* VERIFY OTP BUTTON */}
          {step === 2 && (
            <Button
              onClick={handleVerifyOtp}
              isLoading={isLoading}
              className="w-full"
            >
              Verify OTP
            </Button>
          )}

          {/* PASSWORD STEP */}
          {step === 3 && (
            <>
              <Input
                id="newPassword"
                type="password"
                label="New Password"
                placeholder="••••••••"
                error={errors.newPassword?.message}
                icon={<Lock className="h-4 w-4" />}
                {...register("newPassword")}
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                icon={<Lock className="h-4 w-4" />}
                {...register("confirmPassword")}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full py-3"
              >
                Change Password
              </Button>
            </>
          )}
        </form>

        {/* Login Link */}
        <p className="pt-4 text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link
            href="/signin"
            className="font-semibold text-[#FF5A1F] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
