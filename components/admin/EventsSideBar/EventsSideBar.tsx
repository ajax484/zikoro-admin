"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib";
import { eventsModuleLinks, ModuleNavLink } from "@/constants/moduleLinks";
import { ArrowLeftIcon, CalendarIcon } from "@phosphor-icons/react";

export function EventsSideBar() {
  return <SideNav />;
}

function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed z-[49] inset-y-0 left-0 h-full max-[1024px]:hidden w-[250px]">
      <div className="py-3 sm:py-4 flex flex-col items-center justify-between relative h-full bg-white w-[200px] sm:w-[250px] border-r">
        <div className="flex flex-col gap-y-6 items-start w-full">
          <Image
            src="/logo.png"
            alt="logo"
            width={300}
            height={200}
            className="w-[150px] h-[40px] mx-4"
          />

          <div className="w-full px-4">
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-x-1.5 text-xs text-slate-400 hover:text-basePrimary transition-colors mb-2"
            >
              <ArrowLeftIcon size={13} weight="bold" />
              <span>All Modules</span>
            </button>
            <div className="flex items-center gap-x-2 px-1">
              <CalendarIcon size={16} className="text-basePrimary" weight="duotone" />
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Events
              </span>
            </div>
          </div>

          <ul className="flex flex-col gap-y-1 items-start w-full px-2 overflow-y-auto no-scrollbar h-[calc(100vh-180px)]">
            {eventsModuleLinks.map(({ href, name, Icon }: ModuleNavLink) => {
              const isActive = pathname.startsWith(`/${href}`);
              return (
                <li key={name} className="w-full">
                  <Link
                    href={`/${href}`}
                    className={cn(
                      "p-3 pr-4 pl-4 flex items-center gap-x-2 w-full rounded-md transition-colors",
                      isActive
                        ? "text-basePrimary pl-2 pr-4 bg-[#001fcc]/10 border-l-4 border-basePrimary"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <Icon size={22} className="text-basePrimary" weight="duotone" />
                    <span className="text-sm font-medium">{name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
