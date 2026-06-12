"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon, PencilSimpleIcon, TrashIcon, TagIcon } from "@phosphor-icons/react";
import {
  useFetchSubscriptionPricing,
  useCreateSubscriptionPricing,
  useUpdateSubscriptionPricing,
  useDeleteSubscriptionPricing,
} from "@/queries/SubscriptionPricing.queries";
import { SubscriptionPricing } from "@/types/subscriptions";

const PLAN_OPTIONS = ["Free", "Standard", "Pro", "Plus", "Enterprise"];
const CYCLE_OPTIONS = ["Quarterly", "Biannually", "Yearly"];
const CURRENCY_OPTIONS = ["USD", "NGN"];

type FormState = {
  plan: string;
  subscriptionCycle: string;
  currency: string;
  amount: string;
};

const emptyForm: FormState = {
  plan: "Free",
  subscriptionCycle: "Yearly",
  currency: "USD",
  amount: "",
};

function PlanFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  isLoading,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: FormState;
  onSubmit: (form: FormState) => void;
  isLoading: boolean;
  title: string;
}) {
  const [form, setForm] = useState<FormState>(initial);

  React.useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {PLAN_OPTIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Billing Cycle</Label>
            <Select
              value={form.subscriptionCycle}
              onValueChange={(v) => setForm({ ...form, subscriptionCycle: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                {CYCLE_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading || !form.plan || !form.subscriptionCycle || !form.currency || form.amount === ""}
            onClick={() => onSubmit(form)}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PlanPricingPage() {
  const { data: plans, isFetching } = useFetchSubscriptionPricing("Inventory");
  const createMutation = useCreateSubscriptionPricing();
  const updateMutation = useUpdateSubscriptionPricing();
  const deleteMutation = useDeleteSubscriptionPricing();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPricing | null>(null);

  const handleCreate = async (form: FormState) => {
    await createMutation.mutateAsync({
      plan: form.plan,
      subscriptionCycle: form.subscriptionCycle,
      currency: form.currency,
      amount: Number(form.amount),
      productType: "Inventory",
    });
    setCreateOpen(false);
  };

  const handleUpdate = async (form: FormState) => {
    if (!editing) return;
    await updateMutation.mutateAsync({
      id: editing.id,
      payload: {
        plan: form.plan,
        subscriptionCycle: form.subscriptionCycle,
        currency: form.currency,
        amount: Number(form.amount),
      },
    });
    setEditing(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Plan Pricing</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage Inventory subscription plans, billing cycles, and prices
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <PlusIcon weight="bold" /> Add Pricing
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Inventory Plans</CardTitle>
          <CardDescription>
            Each plan can have multiple price points across billing cycles and currencies
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Plan</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Pricing Alias</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="pl-6 font-semibold text-slate-900">
                    <Badge variant="outline" className="font-medium">
                      {p.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{p.subscriptionCycle}</TableCell>
                  <TableCell className="text-sm text-slate-600">{p.currency}</TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {p.currency} {Number(p.amount ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">{p.pricingAlias}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditing(p)}>
                        <PencilSimpleIcon weight="bold" className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <TrashIcon weight="bold" className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete pricing entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the {p.plan} ({p.subscriptionCycle}, {p.currency}) price point.
                              Workspaces already on this plan will not be affected.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteMutation.mutate(p.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!isFetching && plans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <TagIcon size={32} weight="bold" className="text-slate-300" />
                      No pricing entries yet. Add one to get started.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PlanFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initial={emptyForm}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        title="Add Plan Pricing"
      />

      <PlanFormDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        initial={
          editing
            ? {
                plan: editing.plan || "Free",
                subscriptionCycle: editing.subscriptionCycle || "Yearly",
                currency: editing.currency || "USD",
                amount: String(editing.amount ?? ""),
              }
            : emptyForm
        }
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
        title="Edit Plan Pricing"
      />
    </div>
  );
}
