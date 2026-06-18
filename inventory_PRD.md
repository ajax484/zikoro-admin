# PRD: Inventory Module for Zikoro Admin (Super-Admin Platform)

**Status:** Draft v2 (updated after auditing the existing module)
**Owner:** Platform/Admin team
**Codebases:**
- `zikoro-admin` (this module lives at `app/(mainApp)/admin/inventory/**`) — internal staff app
- `zikoro-inventory` — tenant-facing inventory product (reference for domain model & data)

**Audience:** Zikoro internal staff (Platform Ops, Support, Solutions/Implementation, Finance, Compliance)

---

## 1. Background

`zikoro-admin` already has the skeleton of an **Inventory** module for internal staff, reachable via its own sidebar (`InventorySideBar`) once a staff member enters the "Inventory" module from `/admin`. Today it is almost entirely a **billing & workspace-administration** surface — it does **not** let staff look at a tenant's actual inventory data (products, stock, locations, transfers, adjustments, etc.).

### 1.1 What already exists today

**Navigation** (`constants/moduleLinks.ts → inventoryLinks`), rendered by `InventorySideBar`:

| Nav item | Route | Status |
|---|---|---|
| Workspaces | `/admin/inventory/workspaces` | ✅ Built |
| Plan Pricing | `/admin/inventory/plans` | ✅ Built |
| Transactions | `/admin/inventory/transactions` | ❌ Linked in nav, **no page exists** (404) |
| Verify | `/admin/inventory/verify` | ❌ Linked in nav, **no page exists** (404) |

**`/admin/inventory/workspaces`** (`workspaces/(overview)/page.tsx`)
- 4 KPI cards from `useFetchWorkspacesStats()` backed by `workspace_stats_view.sql`: Total Workspaces, Active Users, Total Orders, Total Purchase Orders.
- Searchable, sortable, paginated `DataTable` of all organizations (`workspacesColumnsFn`): workspace (avatar/name/owner email), Products count, Orders count, Customers count, Team size, Status, Created date.
- Row click → `/admin/inventory/workspaces/[workspaceAlias]`.

**`/admin/inventory/workspaces/[workspaceAlias]`** — per-org detail page
- Header card: avatar initials, org name, Active/Inactive badge (`workspace.activeApps?.inventory`), org type + `organizationAlias`.
- 4 `StatCard`s: Total Products, Total Orders, Total Customers, Total Purchase Orders.
- Tabs (underline/indigo style): **Overview**, **Team**, **Subscription**, **Settings**.
  - **Overview**: "General Information" card (organization alias, phone, owner email, date created) + "Verification Status" card (email/identity/business-doc checks, currently mostly placeholder logic).
  - **Team**: `DataTable` of team members (avatar/name/email, role badge, status badge, joined date) via `useFetchWorkspaceTeamMembers`.
  - **Subscription**: current plan summary card + status badge (Active/Trial/Expired/Cancelled/No Plan), "Manage Subscription" dialog (plan, billing cycle, currency, amount paid, start/end/trial dates, cancel-at-period-end toggle) via `useUpdateWorkspaceSubscription`, and a Payment History table.
  - **Settings** ("Danger Zone"): Deactivate/Reactivate workspace's inventory access (`useSetWorkspaceInventoryAccess`), and permanently Delete Workspace (type-to-confirm `AlertDialog`, `useDeleteWorkspace` — deletes the org across **all** Zikoro apps, not just Inventory).

**`/admin/inventory/plans`**
- CRUD table for Inventory subscription pricing (`useFetchSubscriptionPricing("Inventory")` etc.): Plan (Free/Standard/Pro/Plus/Enterprise), Billing Cycle (Quarterly/Biannually/Yearly), Currency (USD/NGN), Amount, Pricing Alias. Create/Edit dialogs + delete confirmation.

**Orphaned/duplicated routes** (exist on disk but not in `inventoryLinks` nav — appear to be copy-pasted from a generic "Workspace" module and not wired up):
- `workspaces/(overview)/referrals/page.tsx` — static "coming soon" referral program card.
- `workspaces/(overview)/subscriptions/page.tsx` — a second, simpler cross-org subscriptions table (duplicates info already in the per-workspace Subscription tab).

These should be reconciled (removed, merged, or intentionally re-exposed) as part of this work — see §9.

### 1.2 The gap

Everything above is about **commercial/account administration** (billing, access, team). There is **no way for staff to see or manage a tenant's actual inventory records** — products, product groups/variants, categories, manufacturers, vendors, locations, stock levels, stock adjustments, stock transfers, serial numbers, movement ledgers, custom fields, labels. For support and operations use cases ("why is this tenant's stock wrong", "this stock transfer is stuck", "which org owns SKU X"), staff currently have no tooling and must go directly to the database.

This PRD defines how to **close that gap** while fitting cleanly into the module that already exists.

---

## 2. Goals

1. **Complete the existing nav stubs** — build out Transactions and Verify (both already linked in the sidebar).
2. **Tenant inventory drill-down** — from a workspace's detail page, let staff view that org's actual inventory data (products, locations, stock, adjustments, transfers, vendors/manufacturers, movement ledger) read-only by default.
3. **Cross-tenant inventory search** — find a SKU/barcode/serial across all orgs and jump straight to it.
4. **Operational tooling** — surface stuck stock transfers and failed bulk-upload jobs platform-wide; allow audited fixes.
5. **Reconcile/clean up** the duplicated referral & subscription routes.
6. **Governance & audit** — every staff write against tenant data is logged with actor, reason, before/after diff.

### Non-Goals
- Replacing the tenant-facing inventory app or its workflows.
- New inventory business logic — this module surfaces/manages existing entities.
- Unrestricted write access by default (gated by role + "edit mode" + reason).

---

## 3. Personas

| Persona | Needs |
|---|---|
| **Platform Support Agent** | Look up a tenant, view products/locations/stock, diagnose "why is my stock wrong" tickets, view movement ledger for a SKU. |
| **Solutions/Implementation Specialist** | Review onboarding data quality (missing SKUs/categories), check a new tenant's catalog setup. |
| **Platform Ops / Engineering** | Investigate failed bulk uploads, resolve stuck stock transfers. |
| **Finance / Commercial** | Already served by Plan Pricing + Subscription tab; this PRD adds aggregate stock-value visibility (§6.5). |
| **Platform Admin (super-admin)** | Manage shared reference data; configure admin roles/permissions for this module (§7). |

---

## 4. Information Architecture

Extend the existing `inventoryLinks` sidebar rather than introducing a parallel structure:

```
Inventory (InventorySideBar)
├── Workspaces                          ← existing, enhanced
│    └── [workspaceAlias]
│         ├── Overview                  ← existing
│         ├── Team                      ← existing
│         ├── Subscription              ← existing
│         ├── Inventory Data            ← NEW — tenant inventory drill-down (§6.2)
│         │    ├── Products & Groups
│         │    ├── Locations
│         │    ├── Stock Adjustments
│         │    ├── Stock Transfers
│         │    ├── Movement Ledger
│         │    └── Vendors & Manufacturers
│         └── Settings                  ← existing
├── Plan Pricing                        ← existing, unchanged
├── Transactions                        ← NEW — build out stub (§6.1)
├── Verify                              ← NEW — build out stub (§6.1)
├── Search                              ← NEW — cross-tenant SKU/barcode/serial search (§6.3)
├── Operations                          ← NEW (§6.4)
│    └── Stock Transfer Issues
└── Reference Data                      ← NEW, Phase 3 (§6.6)
     └── Default Adjustment Reasons
```

**Cleanup**: remove or fold `workspaces/(overview)/referrals` and `workspaces/(overview)/subscriptions` (see §9).

---

## 5. Functional Requirements — Completing Existing Stubs

### 5.1 Transactions (`/admin/inventory/transactions`)
Currently a dead nav link. Build a page listing inventory-related payment/billing transactions across all orgs — likely sourced from the same `transactionReference`/payment-history data already shown in the per-workspace Subscription tab (`useFetchWorkspaceSubscription` → `history`). Platform-wide view should let Finance:
- Filter by org, status (success/pending/failed), date range, plan.
- Use the existing Payment History table styling (shadcn `Table`, `Badge` status colors) but as a top-level `DataTable` with `TablePagination`, search box, and `GlobalFilterSidebar`-style filters consistent with `/admin/inventory/workspaces`.

### 5.2 Verify (`/admin/inventory/verify`)
Currently a dead nav link, but the Overview tab on a workspace already renders a "Verification Status" card (email/identity/business documents) with a non-functional "Manage Compliance" button. This is backed by the `OrganizationVerification` entity:

```ts
export interface OrganizationVerification {
  id: number;
  createdAt: string;
  workspaceAlias?: string | null;
  address?: string | null;
  country?: string | null;
  incorporationYear?: string | null;
  document?: {
    url: string;
    name: string;
  };
  status?: string | null;
  workspace: TOrganization;
}
```

Build this as the **central queue**:
- `DataTable` of `OrganizationVerification` records across all orgs — columns: workspace (name/alias via `workspace`), address, country, incorporation year, document (link/preview via `document.url`/`document.name`), status (badge — pending/approved/rejected), submitted date (`createdAt`).
- Filter by status and country; search by workspace name/alias.
- Detail/side panel: view submitted document, address, country, incorporation year; Approve/Reject actions (update `status`), with reason capture for rejections — logged to the Audit Log (§7).
- Wire the "Manage Compliance" button on the workspace Overview tab to deep-link here pre-filtered to that org's `workspaceAlias`.

---

## 6. Functional Requirements — New Capabilities

### 6.1 (covered above — §5)

### 6.2 Tenant Inventory Data Drill-Down (new tab on workspace detail page)
Add an **"Inventory Data"** tab alongside Overview/Team/Subscription/Settings on `/admin/inventory/workspaces/[workspaceAlias]`. This is the core new capability. Sub-sections (as inner tabs or a secondary nav within the tab):

- **Products & Groups** — list view mirroring the tenant app's `Products.tsx`: search, status/category/manufacturer/location/serialized/stock-level filters, `DataTable` with product rows, click-through to a detail panel showing Overview / Movement History / Product Info / Variants — **read-only**.
- **Locations** — list of the org's warehouse/locations with per-location stock summaries.
- **Stock Adjustments** — list with date, location, product, quantity, reason, creator; detail view of an individual adjustment.
- **Stock Transfers** — list with status (pending/shipped/received), source/destination, products; detail view with Overview/Products/Shipped/Packages/Received sub-tabs.
- **Movement Ledger** — chronological, filterable audit view of stock movements for a product/location (type, qty, reference: SalesOrder/PurchaseOrder/StockTransfer/Adjustment).
- **Vendors & Manufacturers** — read-only list of the org's vendor/manufacturer records.

**Edit mode**: an explicit toggle (gated by `inventory:write` permission) enables a small set of operator actions — primarily in §6.4 (unsticking transfers) and correcting obviously-bad vendor/manufacturer records. Every edit requires a reason note and is written to the audit trail (§7).

**Reused components**: this should be built with the same `DataTable` + `TablePagination` + Tabs conventions already used on this page (not the tenant app's `MasterDetailLayout`/`GlobalFilterSidebar`, which belong to a different design system — see §8).

### 6.3 Cross-Tenant Search
New top-level nav item, available to anyone with `inventory:read` (no additional access restriction). A single search box (SKU, barcode, serial number, or product name) returning results across **all** orgs:
- Result row: org name/alias, product name, SKU, stock summary.
- Clicking a result deep-links to `/admin/inventory/workspaces/[workspaceAlias]` with the Inventory Data → Products tab pre-opened on that product (mirrors the `pid`/`pa`/`ga` URL-param auto-select pattern already used in the tenant app's `Products.tsx`).
- Requires a new aggregate API endpoint (no current cross-org inventory query exists).

### 6.4 Operations
- **Stock Transfer Issues**: platform-wide list of stock transfers stuck in `pending`/`shipped` beyond a configurable threshold (e.g. 7 days), with org, locations, product summary, days-stuck. Edit-mode actions: mark received, cancel transfer, reassign destination — each with a reason note.
- ~~Bulk Upload Jobs~~ — out of scope. Bulk upload jobs are transient (data is extracted into inventory records immediately and the job itself is disposable), so no platform-wide job-tracking view is needed.

### 6.5 Stock Value Insight (Finance)
Add a 5th KPI card to `/admin/inventory/workspaces` (or a small panel) for **aggregate stock value across the platform** (`SUM(available × productCost)` per org, summed) and a "Top orgs by stock value" mini table — extends the existing `workspace_stats_view` pattern.

### 6.6 Reference Data (Phase 3)
- **Default Adjustment Reasons**: CRUD for the platform-default set of stock-adjustment reasons new orgs are seeded with.
- (Label template library / shared vendor directory: deferred — revisit if support volume justifies it.)

---

## 7. Permissions & Audit Model

- New permission keys scoped to this module, following the `permissionKey` pattern used by the tenant app's roles/permissions system: `inventory:read` (default), `inventory:write`, `inventory:operations`, `inventory:verify`, `inventory:billing`.
- "Inventory Data" tab is visible to anyone with `inventory:read`; the edit-mode toggle requires `inventory:write` and a captured reason.
- All mutations (subscription changes, deactivate/delete workspace, edit-mode inventory edits, verification approvals, transfer fixes) are written to a new **Audit Log** — actor, org, entity type/id, action, before/after diff, reason, timestamp. (Note: `useDeleteWorkspace`, `useSetWorkspaceInventoryAccess`, and `useUpdateWorkspaceSubscription` already exist but are **not currently audited** — bring them into the same audit trail.)
- Audit Log itself can start as a simple filterable table under Operations; a dedicated nav entry can be added once volume warrants it.
- **Retention**: audit log entries are retained for **2 weeks**, after which they are purged.
- **Export**: the Audit Log table supports **CSV export** of the (filtered) current view, for compliance reviews that need a record beyond the retention window.
- All edit-mode mutations against tenant inventory data (§6.2) and operations fixes (§6.4) go through a **dedicated admin mutation layer** in `zikoro-admin` (not a reuse of the tenant app's `useUpdateInventoryProduct`-style hooks), so audit-logging middleware and admin-specific validation live in one place.

---

## 8. UI/UX Requirements (match the existing `/admin/inventory` design system)

This module already has an established look distinct from the tenant app — **match this, not the tenant app's `MasterDetailLayout`/`zikoroBlack` theme**:

- **Page shell**: `InventorySideBar` (fixed 250px, white, border-r, Phosphor `weight="duotone"` icons, active item = `bg-[#001fcc]/10 border-l-4 border-basePrimary`), content area on `bg-[#F7F8FF]`.
- **Cards**: shadcn `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent`, `border-none shadow-sm`, `rounded-xl`/`rounded-2xl`.
- **KPI cards**: large bold numeral + label, icon in a colored rounded-xl chip (`bg-indigo-50 text-indigo-600`, `bg-emerald-50 text-emerald-600`, `bg-amber-50 text-amber-600`, `bg-sky-50 text-sky-600`).
- **Lists**: `@/components/shared/DataTable` + `@/components/shared/TablePagination` for paginated/sortable data (Workspaces table, Team table); plain shadcn `Table`/`TableHeader`/`TableRow` for simple read-mostly lists (Payment History, Plan Pricing).
- **Badges**: `Badge variant="outline"` with semantic color maps — reuse `StatusBadge` / `PlanBadge` / `InitialsAvatar` from `workspaces/_components/WorkspacesCommon.tsx` wherever status/plan/avatar rendering is needed; don't re-invent these.
- **Tabs**: underline style — `border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600`, uppercase tracked-out labels, used for the workspace detail tab strip (Overview/Team/Subscription/Inventory Data/Settings).
- **Dialogs**: shadcn `Dialog` for forms (e.g. Manage Subscription, Plan Pricing CRUD); `AlertDialog` for destructive/irreversible actions, with type-to-confirm input for deletes (pattern already used for Delete Workspace).
- **Color palette**: slate grays (`slate-50/100/400/500/900`) for text/borders/backgrounds, **indigo-600** as the primary interactive accent in this module (tabs, icons, buttons), `basePrimary` (#001FCC) reserved for sidebar active-state, emerald/amber/red/sky for semantic status.
- **Empty/loading states**: `Skeleton` components for loading (as in `UsageSkeleton`), centered icon + heading + description for empty states (as in Plan Pricing's empty table row).
- **New patterns introduced by this PRD** (kept consistent with the above):
  - **Edit-mode banner**: a slim colored bar at the top of the "Inventory Data" tab, e.g. `bg-amber-50 border border-amber-100 text-amber-800`, showing "Edit mode — reason: …" with a toggle to exit.
  - **Audit diff viewer**: simple before/after key-value rows inside a `Card`, consistent with the "General Information" card layout in OverviewTab.
  - **"Days stuck" badge** for Stock Transfer Issues: reuse `Badge` with red/amber thresholds.

---

## 9. Cleanup Tasks

1. `workspaces/(overview)/referrals/page.tsx` and `workspaces/(overview)/subscriptions/page.tsx` — **keep as-is for now**, not in scope for this effort. Both are earmarked for future implementation (referral program, standalone subscriptions view) and should not be deleted or merged as part of this PRD.

---

## 10. Data & API Considerations

- Existing admin queries/mutations live in `queries/Workspaces.queries.tsx` and `mutations/workspaces.mutations.ts`, scoped per `workspaceAlias`, hitting `zikoro-admin`'s own API routes plus `workspace_stats_view`.
- New cross-org endpoints required: cross-tenant search (§6.3), stuck-transfer scan (§6.4), bulk-upload job listing (§6.4), aggregate stock value (§6.5).
- Tenant inventory drill-down (§6.2) needs read access to the same tables the `zikoro-inventory` app uses (`inventoryProducts`, product groups/variants, locations, stock adjustments/transfers, movement ledger, vendors/manufacturers) — either via a shared service-role data layer or new admin-scoped API routes (`/api/admin/inventory/[workspaceAlias]/...`).
- Audit log requires a new table (actor, org, entity type/id, action, diff JSON, reason, timestamp) and a write-path wrapper around existing mutations (`useDeleteWorkspace`, `useSetWorkspaceInventoryAccess`, `useUpdateWorkspaceSubscription`, plus all new edit-mode mutations).

---

## 11. Phasing / Rollout

**Phase 1**
- Cleanup (§9)
- Tenant Inventory Data tab — read-only Products, Locations, Stock Adjustments, Stock Transfers, Movement Ledger, Vendors/Manufacturers (§6.2)
- Cross-Tenant Search (§6.3)
- Admin permission keys (read/write split) — no UI change yet beyond gating

**Phase 2**
- Transactions page (§5.1), Verify queue (§5.2)
- Operations: Stock Transfer Issues + Bulk Upload Jobs (§6.4)
- Edit mode + Audit Log, retrofitted onto existing destructive mutations too

**Phase 3**
- Stock Value Insight KPI (§6.5)
- Reference Data: Default Adjustment Reasons (§6.6)

---

## 12. Open Questions

All open questions from the previous draft have been resolved:

1. ~~Verification backing table~~ — resolved: `OrganizationVerification` (see §5.2 for the interface and how Verify is built on top of it).
2. ~~Bulk Upload Jobs tracking~~ — resolved: out of scope (§6.4); jobs are disposable once data is extracted.
3. ~~Cross-Tenant Search access restriction~~ — resolved: no additional restriction beyond `inventory:read` (§6.3).
4. ~~Edit-mode mutation strategy~~ — resolved: dedicated admin mutation layer in `zikoro-admin` (§7).
5. ~~Audit log retention/export~~ — resolved: 2-week retention with CSV export (§7).
6. ~~`referrals`/`subscriptions` cleanup~~ — resolved: keep both for now, future work (§9).