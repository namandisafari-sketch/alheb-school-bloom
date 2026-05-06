# Build Plan

## Phase 1 — Unblock the build (must come first)

The project currently fails to compile. None of the new features can ship until these are fixed:

- `BudgetReportsTab.tsx`, `AppointmentCard.tsx` — add missing `Badge`, `User`, `MapPin` imports
- `IDCards.tsx` — import `Users` icon; add `barcode_height` to settings type/usage
- `SecurityDashboard.tsx`, `InventoryTracking.tsx` — disambiguate `profiles` join with `profiles!inventory_transactions_*_fkey(full_name)`
- `StaffIDCard.tsx`, `StudentIDCard.tsx` — install `bwip-js` + types; cast `(staff as any).avatar_url` and `(learner as any).village/parish/sub_county` until DB types regenerate
- `AddInventoryItemDialog.tsx` — import `ReactNode` from React
- `BulkIssueDialog.tsx` — type the transaction `type` as `'issuance' as const`
- `ActiveVisitCard.tsx` — relax prop type to `Partial<VisitorVisit>`
- `AppointmentCard.tsx` — remove broken `CheckInDialog` import (replace with inline placeholder)
- `translations.ts` — dedupe the 3 duplicate keys (lines 479, 514, 522)
- `useCalendar.ts`, `useSchools.ts` — wrap insert payloads in arrays / cast to row type
- `Reports.tsx` — add `import { supabase }`, `import { format } from 'date-fns'`, fix the `'emis'` comparison, restore missing `termLabel` variable
- `StaffManagement.tsx` — cast user_roles insert to single object not array
- `Visitors.tsx` — add `district: ''` to the form state and Visitor insert payloads
- `pages/IDCards_backup.tsx.tmp` — delete (not imported, but noise)
- `FeeManagement.tsx` — remove stray `let` and `let 0 be` text that snuck into JSX

## Phase 2 — SchoolPay integration

Replace mobile-money path on Collect Payment with SchoolPay.

**Secrets** (placeholders): `SCHOOLPAY_SCHOOL_CODE`, `SCHOOLPAY_API_PASSWORD`, `SCHOOLPAY_BASE_URL` (default `https://www.schoolpay.co.ug`).

**Edge functions** (all `verify_jwt = true`, JWT validated in code):
- `schoolpay-sync` — GET `/AndroidRS/SyncSchoolTransactions/{schoolCode}/{date}/{hash}`. Hash = MD5(schoolCode + date + password). Upserts pulled transactions into `fee_payments` keyed by SchoolPay payment code.
- `schoolpay-adhoc` — POST adhoc one-time payment request (returns payment code/instructions for parent).
- `schoolpay-webhook` — public endpoint (`verify_jwt = false`) that receives SchoolPay push notifications, validates signature, inserts/updates the matching `fee_payments` row.

**DB migration**:
- Add `schoolpay_payment_code text unique`, `schoolpay_status text`, `schoolpay_raw jsonb`, `payment_method` default `'schoolpay'` to `fee_payments`.
- Settings table row for last successful sync timestamp.

**UI**:
- `CollectPaymentTab` — replace MoMo provider selector with "Generate SchoolPay Payment Code" flow → calls `schoolpay-adhoc`, shows code + instructions, plus a "Sync today's payments" button → calls `schoolpay-sync`.
- `PaymentHistoryTab` — show SchoolPay payment code column.

## Phase 3 — Petty Cash module (image 1)

New page `Finance → Petty Cash` with tabs: **Active Projects**, **Archive**.

**Tables**:
- `petty_cash_projects` — `name`, `start_date`, `petty_cash_amount`, `status` ('active'|'closed'), `closed_at`, `closing_balance`
- `petty_cash_invoices` — `project_id`, `invoice_number` (auto), `date`, `category` (Food/Fuel/Safety/etc), `details`, `value`, `manual_input` text
- `petty_cash_invoice_images` — `invoice_id`, `image_url` (Storage bucket `petty-cash` private)

**Hooks** `usePettyCash.ts` — projects/invoices CRUD, image upload, close-project (computes remaining = amount − sum(invoices)), detailed-report PDF (jsPDF) printable any time, archive view that groups closed projects with their invoices.

**UI**:
- `PettyCashProjectsTab.tsx` — list, create project dialog
- `ProjectDetailDialog.tsx` — invoice list, "Add Invoice" with image upload + manual input, "Close Project" (creates closing report), "Generate Report" anytime
- `PettyCashArchiveTab.tsx` — closed projects with invoices grouped

## Phase 4 — Fees enhancements (image 2)

- Add `fee_classification` enum on learner balances: `full_guarantee` | `partial_guarantee` | `paid`. UI badge in `StudentBalancesTab`.
- Auto-issue invoices each term: cron-style "Issue Term Invoices" button on `FeeStructuresTab` → creates `fee_payments`-linked invoice rows for all active learners.
- Schedule overdue payments — `due_date` + `installment_plan` jsonb on balances; UI to set installments.
- Notifications (in-app via existing `notifications` table; SMS deferred):
  - On payment recorded → notify parent with paid + remaining balance.
  - Cron edge function `fees-reminder` → notifies parent N days before installment due.
  - Weekly/monthly summary `fees-summary` → notifies accountant + center manager roles.

## Technical Notes (for reviewers)

- After the migration the Supabase types file regenerates; remove `(x as any)` casts then. Casts in Phase 1 are temporary.
- SchoolPay sync should be idempotent — unique on `schoolpay_payment_code`.
- All new edge functions use `corsHeaders` from `@supabase/supabase-js/cors` and Zod input validation.
- All new tables get RLS: admins+accountant manage; teachers read; parents read only their own learner rows.

## Order of execution in this loop

1. Phase 1 (one big batch of edits) → confirm build passes.
2. Phase 2 migration + edge functions + UI.
3. Phase 3 migration + storage bucket + UI.
4. Phase 4 migration + cron edge functions + UI badges.

Phases 2–4 each end with a single migration call (per Lovable rule of one migration per call).
