"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  Bell,
  Shield,
  ToggleLeft,
  ToggleRight,
  Database,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useOnboarding } from "@/context/OnboardingContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const INDUSTRIES = [
  "Retail & E-commerce",
  "Manufacturing",
  "Wholesale & Distribution",
  "Logistics & Supply Chain",
  "Technology & Electronics",
  "Healthcare & Pharma",
  "Other",
];

const ORG_SIZES = [
  { label: "1 - 10", value: "1-10" },
  { label: "11 - 50", value: "11-50" },
  { label: "51 - 200", value: "51-200" },
  { label: "201+", value: "201+" },
];

const settingsSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  orgSize: z.string().min(1, "Please select an organization size"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  lowStockLimit: z.number({ message: "Limit must be a number" }).min(0, "Limit must be at least 0"),
  skuPrefix: z.string().min(1, "SKU prefix must be at least 1 character"),
  emailAlerts: z.boolean(),
  autoReorder: z.boolean(),
  apiTracking: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsTab() {
  const { companyInfo, updateCompanyInfo } = useOnboarding();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: companyInfo.companyName || "",
      industry: companyInfo.industry || "",
      orgSize: companyInfo.orgSize || "1-10",
      email: companyInfo.email || "",
      phone: companyInfo.phone || "",
      address: companyInfo.address || "",
      lowStockLimit: 10,
      skuPrefix: "INV-",
      emailAlerts: true,
      autoReorder: false,
      apiTracking: false,
    },
  });

  const selectedOrgSize = watch("orgSize");
  const emailAlerts = watch("emailAlerts");
  const autoReorder = watch("autoReorder");
  const apiTracking = watch("apiTracking");

  const onSubmit = (data: SettingsFormValues) => {
    setSaveStatus("saving");

    // Save company info back to the React Context
    updateCompanyInfo({
      companyName: data.companyName,
      industry: data.industry,
      orgSize: data.orgSize,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });

    // Simulate save duration
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-950 md:text-3xl">Configuration Settings</h1>
          <p className="text-sm text-gray-500 font-medium font-sans">
            Fine-tune company details, inventory alerts, notifications, and integration settings.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Company profile Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <Building2 className="h-4.5 w-4.5" />
            Company Information
          </h3>

          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Company Name */}
              <div>
                <Input
                  label="Company Name"
                  id="companyName"
                  placeholder="e.g. Acme Corp"
                  icon={<Building2 className="h-5 w-5" />}
                  error={errors.companyName?.message}
                  {...register("companyName")}
                />
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="industry" className="mb-2 block text-sm font-medium text-slate-700">
                  Industry
                </label>
                <div className="relative rounded-2xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <select
                    id="industry"
                    {...register("industry")}
                    className={`block w-full rounded-2xl border bg-transparent pl-11 pr-10 py-2.5 text-sm text-gray-900 focus:border-[#FF5A1F] focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all duration-300 appearance-none ${
                      errors.industry ? "border-red-500" : "border-slate-200"
                    }`}
                  >
                    <option value="" disabled>
                      Select your industry
                    </option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.industry?.message && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {errors.industry.message}
                  </p>
                )}
              </div>
            </div>

            {/* Organization Size */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Organization Size
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ORG_SIZES.map((size) => {
                  const isSelected = selectedOrgSize === size.value;
                  return (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => setValue("orgSize", size.value, { shouldDirty: true })}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 transition-all duration-200 text-sm font-medium cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm shadow-orange-100"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Users className={`h-5 w-5 mb-1.5 ${isSelected ? "text-orange-500" : "text-gray-400"}`} />
                      {size.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Contact Email */}
              <div>
                <Input
                  label="Work Email"
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  icon={<Mail className="h-5 w-5" />}
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              {/* Phone */}
              <div>
                <Input
                  label="Phone Number"
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  icon={<Phone className="h-5 w-5" />}
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <Input
                label="Headquarters Address"
                id="address"
                placeholder="123 Main St, New York, NY"
                icon={<MapPin className="h-5 w-5" />}
                error={errors.address?.message}
                {...register("address")}
              />
            </div>
          </div>
        </div>

        {/* Inventory System Settings */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <Database className="h-4.5 w-4.5" />
            Inventory Settings
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Input
                label="Low Stock Threshold Limit"
                id="lowStockLimit"
                type="number"
                error={errors.lowStockLimit?.message}
                {...register("lowStockLimit", { valueAsNumber: true })}
              />
              <p className="text-3xs text-gray-400 mt-1.5 leading-normal">
                Items drop below this quantity will flag low stock warnings.
              </p>
            </div>

            <div>
              <Input
                label="Automated SKU Prefix"
                id="skuPrefix"
                error={errors.skuPrefix?.message}
                {...register("skuPrefix")}
              />
              <p className="text-3xs text-gray-400 mt-1.5 leading-normal">
                Standard characters prepended to new assets barcodes.
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <Bell className="h-4.5 w-4.5" />
            Notification Rules
          </h3>

          <div className="space-y-4">
            {/* Rule 1 */}
            <div
              onClick={() => setValue("emailAlerts", !emailAlerts)}
              className="flex items-center justify-between cursor-pointer py-1"
            >
              <div>
                <h4 className="text-sm font-bold text-gray-900">Email Low Stock Warnings</h4>
                <p className="text-xs text-gray-400 leading-normal mt-0.5">
                  Receive daily notifications for critical items.
                </p>
              </div>
              <button type="button" className="cursor-pointer">
                {emailAlerts ? (
                  <ToggleRight className="h-9 w-9 stroke-1 text-orange-600 fill-orange-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9 stroke-1 text-gray-300" />
                )}
              </button>
            </div>

            {/* Rule 2 */}
            <div
              onClick={() => setValue("autoReorder", !autoReorder)}
              className="flex items-center justify-between cursor-pointer py-1"
            >
              <div>
                <h4 className="text-sm font-bold text-gray-900">Purchase Auto-Reorders</h4>
                <p className="text-xs text-gray-400 leading-normal mt-0.5">
                  Generate purchase draft drafts when safety margins are crossed.
                </p>
              </div>
              <button type="button" className="cursor-pointer">
                {autoReorder ? (
                  <ToggleRight className="h-9 w-9 stroke-1 text-orange-600 fill-orange-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9 stroke-1 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-5 flex items-center gap-1.5 border-b border-gray-50 pb-3">
            <Shield className="h-4.5 w-4.5" />
            Integrations & Security
          </h3>

          <div
            onClick={() => setValue("apiTracking", !apiTracking)}
            className="flex items-center justify-between cursor-pointer py-1"
          >
            <div>
              <h4 className="text-sm font-bold text-gray-900">Enable Webhook Audit Notifications</h4>
              <p className="text-xs text-gray-400 leading-normal mt-0.5">
                Post logs automatically to external developer systems.
              </p>
            </div>
            <button type="button" className="cursor-pointer">
              {apiTracking ? (
                <ToggleRight className="h-9 w-9 stroke-1 text-orange-600 fill-orange-500" />
              ) : (
                <ToggleLeft className="h-9 w-9 stroke-1 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Action Button & Status */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div>
            {saveStatus === "saved" && (
              <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 animate-fadeIn">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Configuration saved successfully!
              </div>
            )}
          </div>
          <Button
            type="submit"
            isLoading={saveStatus === "saving"}
            disabled={saveStatus === "saved"}
          >
            {saveStatus === "saved" ? (
              "Configuration Saved"
            ) : (
              <>
                <Save className="h-4.5 w-4.5" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
