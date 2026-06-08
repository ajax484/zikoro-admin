import React from "react";
import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { TOASTER_PROPS } from "@/lib";

export const metadata: Metadata = {
  title: "Zikoro Admin",
};

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster {...TOASTER_PROPS} />
      {children}
    </>
  );
}
