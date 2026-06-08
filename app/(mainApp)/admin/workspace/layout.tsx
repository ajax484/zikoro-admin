import React from "react";
import { WorkspaceSideBar } from "@/components/admin/WorkspaceSideBar/WorkspaceSideBar";

export default function WorkspaceModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative w-full h-full bg-[#F7F8FF]">
      <WorkspaceSideBar />
      <div className="lg:w-[calc(100%-250px)] min-[1024px]:float-right bg-[#F7F8FF] pb-12">
        {children}
      </div>
    </main>
  );
}
