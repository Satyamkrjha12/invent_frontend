"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  {
    id: "01",
    title: "Welcome Setup",
    description:
      "Define your industry, business size and organizational requirements.",
  },
  {
    id: "02",
    title: "Organization Details",
    description:
      "Configure company profile, timezone, currency and tax settings.",
  },
  {
    id: "03",
    title: "Team Invitations",
    description:
      "Invite managers, sales teams and warehouse operators securely.",
  },
  {
    id: "04",
    title: "Warehouse Setup",
    description:
      "Create warehouses, branches and inventory storage locations.",
  },
];

export default function OnboardingSection() {
  const router = useRouter();


  const handleClick = () => {
    if (window.location.pathname === "/signin") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      router.push("/signin");
    }
  };
  return (
    <section id="setup" className="bg-[#FFFAF7] py-32">
      <div className="mx-auto max-w-7xl px-6">

        {/* Badge */}
        <div className="flex justify-center">
          <span className="rounded-full border border-[#FFE0CF] bg-[#FFF4EE] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF5A1F]">
            Guided Setup Flow
          </span>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Get started in
            <span className="block bg-gradient-to-r from-[#FF5A1F] to-[#FF8A4C] bg-clip-text text-transparent">
              under 3 minutes
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Our onboarding wizard guides you through every step,
            helping you configure warehouses, products, inventory,
            and team members without complexity.
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 max-w-5xl rounded-[32px] border border-[#FFE0CF] bg-white p-10 shadow-xl shadow-orange-50"
        >
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step) => (
              <motion.div
                key={step.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-gray-100 bg-[#FFFAF7] p-5 transition-all duration-300 hover:border-[#FFE0CF]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4EE] font-bold text-[#FF5A1F]">
                  {step.id}
                </div>

                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex w-full justify-center border-t border-gray-100 pt-8">
            <button onClick={() => handleClick()}
              className="group inline-flex w-full  items-center justify-center gap-2 rounded-2xl bg-[#FF5A1F] px-8 py-4 font-semibold text-white shadow-lg shadow-orange-100 transition-all duration-300 hover:scale-[1.02] hover:bg-[#FF6B35] hover:shadow-xl hover:shadow-orange-200">
              Create Account & Start Setup

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}