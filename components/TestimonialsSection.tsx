"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Operations Manager",
    company: "Mehta Distribution",
    review:
      "The onboarding process was incredibly smooth. We configured warehouses, invited staff, and started managing inventory within minutes.",
  },
  {
    name: "Sarah Jenkins",
    role: "Founder",
    company: "Jenkins Apparel",
    review:
      "Role management and warehouse setup saved us countless hours. The platform feels modern, intuitive, and built for growing businesses.",
  },
  {
    name: "Hideo Tanaka",
    role: "Director",
    company: "Tanaka Precision",
    review:
      "CSV imports, inventory tracking, and warehouse controls work flawlessly. The interface is beautiful and extremely responsive.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="py-12 bg-gradient-to-b from-orange-50 via-white to-[#FFFAF7]">
      <div className="mx-auto max-w-7xl px-6">

        {/* Badge */}
        <div className="flex justify-center">
          <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            Customer Stories
          </span>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Trusted by growing
            <span className="block bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              warehouse teams
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Thousands of businesses rely on our inventory platform
            to manage products, warehouses, suppliers, and teams.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
              }}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
            >
              {/* Stars */}
              <div className="mb-6 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="mb-8 leading-relaxed text-gray-600">
                "{item.review}"
              </p>

              {/* User */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900">
                    {item.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {item.role}
                  </p>

                  <p className="text-sm text-orange-500">
                    {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}