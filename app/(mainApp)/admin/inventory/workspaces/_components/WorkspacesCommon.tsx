// Shared components for the inventory workspaces module
// Identical to the original — no path changes needed here
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircleIcon, ClockIcon, PauseCircleIcon, BellIcon } from "@phosphor-icons/react";

export const StatusBadge = ({ status }: { status: string | boolean }) => {
  const isActive = status === "active" || status === true;
  const isTrial = status === "trial";
  const isPaused = status === "paused";

  const styles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    trial: "bg-blue-50 text-blue-700 border-blue-100",
    paused: "bg-amber-50 text-amber-700 border-amber-100",
    inactive: "bg-red-50 text-red-700 border-red-100",
  };

  const currentStatus = isActive ? "active" : isTrial ? "trial" : isPaused ? "paused" : "inactive";

  const icons: Record<string, React.ReactNode> = {
    active: <CheckCircleIcon weight="bold" className="w-3 h-3 mr-1" />,
    trial: <ClockIcon weight="bold" className="w-3 h-3 mr-1" />,
    paused: <PauseCircleIcon weight="bold" className="w-3 h-3 mr-1" />,
    inactive: <BellIcon weight="bold" className="w-3 h-3 mr-1" />,
  };

  return (
    <Badge
      variant="outline"
      className={`font-medium capitalize ${styles[currentStatus] || ""}`}
    >
      {icons[currentStatus]}
      {currentStatus}
    </Badge>
  );
};

export const PlanBadge = ({ plan }: { plan: string }) => {
  const styles: Record<string, string> = {
    Enterprise: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Pro: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Growth: "bg-sky-50 text-sky-700 border-sky-100",
    Basic: "bg-slate-50 text-slate-700 border-slate-100",
  };

  return (
    <Badge variant="outline" className={`font-medium ${styles[plan] || "bg-slate-50 text-slate-700"}`}>
      {plan || "Free"}
    </Badge>
  );
};

export const InitialsAvatar = ({ name, className }: { name: string; className?: string }) => {
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "WS";
  return (
    <Avatar className={`h-8 w-8 rounded-lg ${className}`}>
      <AvatarFallback className="rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
