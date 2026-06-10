"use client";

import React from "react";
import { Check, ArrowLeft, ArrowRight, ToggleLeft, ToggleRight, Hash, QrCode, Calendar, Shield, DollarSign, User } from "lucide-react";

interface AssetFieldsProps {
  data: {
    assetFields: string[];
  };
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const AVAILABLE_FIELDS = [
  {
    id: "serial_number",
    name: "Serial Number",
    description: "Unique manufacturer ID for individual items.",
    icon: Hash,
    requiredByDefault: false,
  },
  {
    id: "barcode",
    name: "Barcode / QR Code",
    description: "Supports scanner-based checkout and audits.",
    icon: QrCode,
    requiredByDefault: true,
  },
  {
    id: "purchase_price",
    name: "Purchase Price / Cost",
    description: "Track monetary value and asset depreciation.",
    icon: DollarSign,
    requiredByDefault: false,
  },
  {
    id: "purchase_date",
    name: "Purchase Date",
    description: "Record purchase transaction dates.",
    icon: Calendar,
    requiredByDefault: false,
  },
  {
    id: "warranty_expiry",
    name: "Warranty Expiration",
    description: "Alerts when warranty periods are ending.",
    icon: Shield,
    requiredByDefault: false,
  },
  {
    id: "supplier",
    name: "Supplier / Vendor",
    description: "Maintain records of where the asset was bought.",
    icon: User,
    requiredByDefault: false,
  },
];

export default function AssetFields({ data, onChange, onNext, onBack }: AssetFieldsProps) {
  const toggleField = (fieldId: string) => {
    const isEnabled = data.assetFields.includes(fieldId);
    let updated: string[];

    if (isEnabled) {
      updated = data.assetFields.filter((f) => f !== fieldId);
    } else {
      updated = [...data.assetFields, fieldId];
    }
    onChange("assetFields", updated);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-50/50">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Custom Asset Tracking Fields</h2>
        <p className="mt-2 text-sm text-gray-500">
          Decide which parameters are tracked for items in your inventory.
        </p>
      </div>

      <div className="space-y-4">
        {AVAILABLE_FIELDS.map((field) => {
          const isEnabled = data.assetFields.includes(field.id);
          const IconComponent = field.icon;

          return (
            <div
              key={field.id}
              onClick={() => toggleField(field.id)}
              className={`flex items-center justify-between rounded-2xl border p-5 transition-all duration-300 cursor-pointer
                ${
                  isEnabled
                    ? "border-orange-500 bg-orange-50/30 shadow-sm shadow-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-xl p-2.5 mt-0.5 ${isEnabled ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{field.name}</h4>
                    {field.requiredByDefault && (
                      <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 uppercase">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {field.description}
                  </p>
                </div>
              </div>

              <div>
                {isEnabled ? (
                  <div className="text-orange-600 transition-colors">
                    <ToggleRight className="h-9 w-9 stroke-1 fill-orange-500" />
                  </div>
                ) : (
                  <div className="text-gray-300 transition-colors">
                    <ToggleLeft className="h-9 w-9 stroke-1" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-8 border-t border-gray-100 pt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-gray-600 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-white bg-orange-500 rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Next Step
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
