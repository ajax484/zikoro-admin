"use client";

import Link from "next/link";
import {
  ArchiveIcon,
  HouseLineIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { BadgeIcon } from "lucide-react";

const modules = [
  {
    id: "inventory",
    label: "Inventory",
    description: "Manage workspaces, subscriptions, transactions and verification.",
    href: "/admin/inventory/workspaces",
    Icon: ArchiveIcon,
    color: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    id: "credentials",
    label: "Credentials",
    description: "Manage verification and credentials.",
    href: "/admin/credentials",
    Icon: BadgeIcon,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "events",
    label: "Events",
    description: "Review, publish and manage platform events end-to-end.",
    href: "/admin/events",
    Icon: CalendarIcon,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

export default function AdminHubPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FF] flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Modules
          </h1>
          <p className="text-slate-500 text-sm">
            Select a module to manage your platform.
          </p>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {modules.map(({ id, label, description, href, Icon, bg, iconColor }) => (
            <Link
              key={id}
              href={href}
              className="group flex flex-col gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:border-indigo-100 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={24} className={iconColor} weight="duotone" />
              </div>

              <div className="flex-1 space-y-1">
                <h2 className="text-base font-semibold text-slate-900">{label}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 group-hover:gap-2 transition-all">
                <span>Open</span>
                <ArrowRightIcon size={13} weight="bold" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
