"use client";

import React from "react";
import { Building2, Mail, Phone, MapPin, Briefcase, Users } from "lucide-react";

interface CompanyInfoProps {
  data: {
    companyName: string;
    industry: string;
    orgSize: string;
    email: string;
    phone: string;
    address: string;
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
}

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

export default function CompanyInfo({ data, onChange, onNext }: CompanyInfoProps) {
  const isFormValid = data.companyName.trim() !== "" && data.industry !== "";

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-50/50">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
        <p className="mt-2 text-sm text-gray-500">
          Tell us about your organization to customize your inventory dashboard.
        </p>
      </div>

      <div className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Name <span className="text-orange-500">*</span>
          </label>
          <div className="relative rounded-2xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Building2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              required
              value={data.companyName}
              onChange={(e) => onChange("companyName", e.target.value)}
              placeholder="Acme Corp"
              className="block w-full rounded-2xl border-gray-200 pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 transition-all duration-200"
            />
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Industry <span className="text-orange-500">*</span>
          </label>
          <div className="relative rounded-2xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={data.industry}
              onChange={(e) => onChange("industry", e.target.value)}
              className="block w-full rounded-2xl border-gray-200 pl-11 pr-10 py-3.5 text-gray-900 focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 transition-all duration-200 appearance-none bg-transparent"
            >
              <option value="" disabled>Select your industry</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Organization Size */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Organization Size
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ORG_SIZES.map((size) => {
              const isSelected = data.orgSize === size.value;
              return (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => onChange("orgSize", size.value)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 transition-all duration-200 text-sm font-medium
                    ${
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

        {/* Contact Info (Row) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Work Email
            </label>
            <div className="relative rounded-2xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={data.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="contact@company.com"
                className="block w-full rounded-2xl border-gray-200 pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 transition-all duration-200"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative rounded-2xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="block w-full rounded-2xl border-gray-200 pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Headquarters Address
          </label>
          <div className="relative rounded-2xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="123 Main St, New York, NY"
              className="block w-full rounded-2xl border-gray-200 pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 focus:outline-none border focus:ring-4 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 border-t border-gray-100 pt-6 flex justify-end">
        <button
          type="button"
          disabled={!isFormValid}
          onClick={onNext}
          className={`px-8 py-3.5 font-semibold text-white rounded-2xl shadow-lg transition-all duration-200
            ${
              isFormValid
                ? "bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] shadow-orange-200 active:scale-95 cursor-pointer"
                : "bg-gray-300 shadow-none cursor-not-allowed"
            }`}
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
