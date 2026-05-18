"use client";
import React from "react";
import ForgotPasswordComponent from "@/components/forgot/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9faff] px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <ForgotPasswordComponent />
      </div>
    </div>
  );
}
