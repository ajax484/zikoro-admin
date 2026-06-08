"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShareNetwork } from "@phosphor-icons/react";

export default function WorkspacesReferralsPage() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Referral Program</CardTitle>
          <CardDescription>Invite other organizations and earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
            <ShareNetwork size={40} weight="bold" />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-slate-900">Referral system integration coming soon</h3>
            <p className="text-slate-500 mt-2">
              We are working on an exciting rewards program for our top-performing workspaces.
              Check back soon to start earning!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
