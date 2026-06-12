"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsPanel } from "./ProductsPanel";
import { TransfersPanel } from "./TransfersPanel";
import {
  LocationsPanel,
  AdjustmentsPanel,
  LedgerPanel,
  VendorsPanel,
} from "./SimpleListPanels";

const SUB_TABS = [
  { value: "products", label: "Products & Groups" },
  { value: "locations", label: "Locations" },
  { value: "adjustments", label: "Stock Adjustments" },
  { value: "transfers", label: "Stock Transfers" },
  { value: "ledger", label: "Movement Ledger" },
  { value: "vendors", label: "Vendors & Manufacturers" },
];

export const InventoryDataTab = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const searchParams = useSearchParams();
  const deepLinkProductAlias = searchParams.get("pa");
  const [activeSubTab, setActiveSubTab] = useState(deepLinkProductAlias ? "products" : "products");

  return (
    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
      <TabsList className="bg-transparent h-auto p-0 gap-6 border-b border-slate-200 w-full justify-start rounded-none overflow-x-auto">
        {SUB_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-slate-400 data-[state=active]:text-indigo-600 transition-all uppercase tracking-wider text-xs whitespace-nowrap"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="products" className="mt-4">
        <ProductsPanel workspaceAlias={workspaceAlias} initialProductAlias={deepLinkProductAlias} />
      </TabsContent>
      <TabsContent value="locations" className="mt-4">
        <LocationsPanel workspaceAlias={workspaceAlias} />
      </TabsContent>
      <TabsContent value="adjustments" className="mt-4">
        <AdjustmentsPanel workspaceAlias={workspaceAlias} />
      </TabsContent>
      <TabsContent value="transfers" className="mt-4">
        <TransfersPanel workspaceAlias={workspaceAlias} />
      </TabsContent>
      <TabsContent value="ledger" className="mt-4">
        <LedgerPanel workspaceAlias={workspaceAlias} />
      </TabsContent>
      <TabsContent value="vendors" className="mt-4">
        <VendorsPanel workspaceAlias={workspaceAlias} />
      </TabsContent>
    </Tabs>
  );
};
