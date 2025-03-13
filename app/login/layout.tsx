import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: `Login Page`,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
