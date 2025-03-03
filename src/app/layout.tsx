import React from "react";
import type { Metadata } from "next";
import { montserrat } from "@/constants/fonts";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";
import { AdminSideBar } from "@/components/admin/AdminSideBar/AdminSideBar";

export const metadata: Metadata = {
  title: "Admin Zikoro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="text-mobile sm:text-desktop">
      <head></head>

      <body className={`${montserrat.className}`}>
        <main className={`relative w-full h-full bg-[#F9FAFF]`}>
          <AdminSideBar />

          <div className="lg:w-[calc(100%-250px)]  min-[1024px]:float-right  pb-12  ">
            {children}
          </div>
        </main>
        <Toaster {...TOASTER_PROPS} />
      </body>
    </html>
  );
}
