"use client";

import Navbar from "@/components/layout/Navbar";
import { Albert_Sans } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-albert",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        style={{
          width: collapsed ? "calc(100% - 70px)" : "calc(100% - 180px)",
        }}
        className="flex flex-col transition-all duration-300 "
      >
        <Navbar />
        <main className="bg-gray-200 min-h-screen flex-1 height-100vh overflow-auto flex justify-center">
          <div className={`p-6 w-full max-w-[1400px] ${albertSans.className}`}>
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
