import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OnboardingProvider } from "@/context/OnboardingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StockKeep - Smart Inventory & Warehouse Management System",
  description: "Streamline your business operations with StockKeep. Manage inventory, optimize warehouse storage, track assets, and coordinate team members in real-time.",
  keywords: ["inventory management", "warehouse tracking", "asset management", "stock management", "multi-warehouse", "SaaS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OnboardingProvider>{children}</OnboardingProvider>
      </body>
    </html>
  );
}
