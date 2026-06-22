import { Building2, Boxes, ShieldCheck, Users } from "lucide-react";

export default function AuthBanner() {
  const features = [
    {
      icon: Building2,
      text: "Multi-Warehouse Management",
    },
    {
      icon: Boxes,
      text: "Real-Time Inventory Tracking",
    },
    {
      icon: Users,
      text: "Role-Based Team Access",
    },
    {
      icon: ShieldCheck,
      text: "Enterprise Security",
    },
  ];

  const stats = [
    {
      value: "10K+",
      label: "Products",
    },
    {
      value: "99.9%",
      label: "Uptime",
    },
    {
      value: "50+",
      label: "Warehouses",
    },
    {
      value: "500+",
      label: "Businesses",
    },
  ];

  return (
    <div className="w-full rounded-[28px] p-6 lg:p-8">
      {/* Badge */}
      <div className="mb-4 inline-flex w-fit items-center rounded-full border border-orange-200 bg-[#FFF4EE] px-3 py-1.5 text-xs font-medium text-[#FF5A1F]">
        Inventory Management SaaS
      </div>

      {/* Heading */}
      <h1 className="max-w-lg text-3xl font-black leading-tight tracking-tight text-slate-900 lg:text-4xl">
        Manage Your Entire{" "}
        <span className="block bg-gradient-to-r from-[#FF5A1F] to-[#FF8A4C] bg-clip-text text-transparent">
          Inventory Business
        </span>{" "}
        From One Platform
      </h1>

      {/* Description */}
      <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
        Track inventory, manage warehouses, control team access and streamline
        operations with a platform built for modern businesses.
      </p>

      {/* Features */}
      <div className="mt-6 grid gap-3">
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4EE] text-[#FF5A1F]">
                <Icon size={18} />
              </div>

              <span className="text-sm font-medium text-slate-700">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
          >
            <h3 className="text-2xl font-black text-[#FF5A1F]">{stat.value}</h3>

            <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
