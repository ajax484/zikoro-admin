"use client";
import React, { Suspense } from "react";
import AppointmentLoginForm from "@/components/login/AppointmentLoginForm";

function LoginContent() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#f9faff] px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <AppointmentLoginForm />
      </div>
    </div>
  );
}

export default function AppointmentLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-[#f9faff]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
