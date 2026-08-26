# BodyFix CRM convergence audit

Date: 2026-08-11. This is a repository audit, not a statement about the live
Supabase database. Production migrations and customer imports were not run.

## Current-state summary

The repository is a Next.js App Router application (TypeScript, React, npm,
Supabase, Vitest and ESLint). The operational CRM already uses `clients` and
`service_records`; it is not safe to introduce a parallel customer master.
Admin authentication is an eight-hour signed, HTTP-only session used by the
booking admin APIs. The former `/clinic` pages called authenticated
`/api/clinic/**` handlers backed by a Supabase service-role client.

The SQL is not a replayable representation of one coherent production schema.
In particular, Pulse creates free-text appointment, income, and follow-up
tables and inserts demonstration people and amounts. Dashboard code references
finance objects whose defining migration is absent. Production schema
introspection and row counts therefore remain an Owner-run preflight.

## Data and route convergence table

| Existing source | Repository reader/writer | Canonical decision | Migration state |
| --- | --- | --- | --- |
| `clients` | CRM, intake resolver, booking | BodyFix person master (`clients.id`) | Retain; do not create `customers` |
| `service_records` | CRM records and summaries | Completed service and 4R source | Retain; portal must become a projection |
| `followups` | CRM dashboard and follow-up UI | Transitional task source | Map to task/outreach split before write cutover |
| `plan_candidates` | CRM conversion APIs | Canonical candidate name | Runtime currently agrees; do not add `package_candidates` |
| `booking_requests` | booking/admin | Request and slot-hold source only | Must not count as attendance or revenue |
| `intake_submissions` | public intake and resolver | Submission/lead until resolved | Existing resolver blocks ambiguous matches |
| `client_profiles`, `client_bookings`, `client_service_records` | Client Portal | Authorized read projection | Live-schema/RLS inspection required before cutover |
| `pulse_*` | `/admin/crm/pulse` | Legacy read source only | Demo inserts and free-text identities block canonical claim |
| location-demand and city tables | public demand and CRM operations | Lead/operations domains | Do not create a client from interest alone |
| Google Sheet A:T | LINE webhook and cron | Legacy channel mirror | Must not overwrite the client master |
| `/admin/crm/**` | migrated CRM pages | Canonical authenticated operations namespace | Implemented for every former UI route |
| `/clinic/**` | old bookmarks | 308 compatibility redirect | Preserves subpath, dynamic ID, and query |
| `/OS` | new branded entry | BodyFix OS entry, not a CRM database | Links to authenticated CRM and login |
| `/api/clinic/**` | existing page mutations | Transitional compatibility API | Kept in place; shared services/new namespace are a later cutover |

## Canonical Route Ownership

| Domain | Canonical route | Legacy route | Status |
| --- | --- | --- | --- |
| BodyFix Admin | `/admin` | `/dashboard` | Admin is the sole operations entry; dashboard root uses 308 compatibility |
| CRM | `/admin/crm/**` | `/clinic/**` | 308 compatibility preserving subpath and query |
| Pulse | `/admin/crm/pulse/**` | `/admin/pulse/**` | One moved implementation; 308 compatibility preserving subpath and query |
| Booking | `/admin/booking` | booking controls formerly presented directly on `/admin` | Existing UI and APIs extracted unchanged into an authenticated canonical module |
| Customer finance | future CRM finance module | `/dashboard/customers` | Transitional: balances, low-credit, unpaid and flexible-payment views are not yet present in CRM clients |
| Fulfillment checkout | future canonical appointment/finance workflow | `/dashboard/appointments` | Transitional: combines completed service, payment, ledger and follow-up actions; unsafe to redirect to one existing page |
| Digital readings | future Chart Navigator domain route | `/dashboard/readings` | Transitional: digital orders and campaign entitlements cross the BodyFix domain boundary; not linked from primary navigation |
| Strategic Decisions | `/admin/strategic-decisions` | none | Existing strategy tool retained |
| Client Portal | `/client/**` | none | Customer-side authorized projection; does not move into CRM |
| Public Intake | `/intake` | none | Public questionnaire feeding the CRM core; UI remains outside Admin |
| BodyFix OS | `/OS` | none | Branded system entry only; links onward to Admin/CRM and is not an operations dashboard |

The transitional `/api/clinic/**` namespace remains the shared, authenticated
service layer during UI route convergence. This round does not rename those
handlers or create a second API implementation.

Admin, CRM, Booking, and Pulse use the same signed `bodyfix_admin_session`.
When Preview bypass is explicitly allowed outside Vercel production, `/admin`
bootstraps that server-readable session through the existing login endpoint and
keeps Booking in Local Preview Mode. Production continues to require the admin
password; Preview authentication does not grant permission to write production
data.

### Round boundary

* No Supabase migration.
* No production data mutation.
* No customer import.
* No production reconciliation or schema introspection.

## SQL drift inventory

* `supabase/clinic-v1.sql` creates canonical `clients`, `service_records`,
  `followups`, and `plan_candidates`.
* `supabase/client-portal-v1.sql` introduces portal-named records that may
  duplicate canonical bookings and service summaries.
* `supabase/pulse-v1.sql` inserts demonstration records and stores people by
  name, without canonical IDs.
* Dashboard customer and appointment code references `customer_balance_view`,
  `customer_balances`, `ledger_entries`, `package_purchases`, `payments`, and a
  completion RPC, but this repository has no complete finance migration for
  those objects.
* `customer_id` and `client_id` coexist across operational areas. They require
  typed adapters and foreign-key inspection, not a global rename.

## Safe application order

1. Back up and introspect the live schema, policies, functions, constraints,
   and row counts read-only; compare them with every SQL file above.
2. Remove demo inserts from a new forward migration (never delete production
   rows based only on names) and add nullable canonical IDs to legacy Pulse
   data, followed by a manual reconciliation report.
3. Add identity, role, consent, task/outreach, journey, organization, and
   finance structures only after equivalent live objects are identified.
4. Deterministically backfill source table and source ID, review conflicts,
   then switch reads before writes. Any temporary dual write needs an owner,
   reconciliation query, and removal date.
5. Apply RLS and authorization tests before exposing a new projection. Use a
   forward fix rather than dropping canonical history.

## Historical/import sources

The referenced private spreadsheet and 620,019-byte historical bundle are not
present in this checkout, so their hashes and figures could not be independently
verified. The reported 519 clients / 609 services / NT$1,635,768 snapshot and
the separate 934 / 78 / 80 plan have incompatible definitions. Neither is
production truth. A future dry run must inventory file hash, sheet, rows,
deduplication rule, service/payment mapping, and masked conflict IDs; no private
source file or derived fixture may be committed.

## External draft boundary

No Git remote is configured in this checkout, so PR #166 and #168 could not be
fetched or verified here. Their draft designs must not be assumed deployed.
Preview/confirm/idempotency/audit for the write bridge and fail-closed LINE
takeover checks remain required before those external write/send paths can be
declared converged.

## Rollback / forward-fix

The route move contains no data migration. Reverting the application commit
restores page ownership; the compatibility redirect has no stored state. Once
deployed, bookmarks remain reversible because old paths contain the complete
subpath and query. Database reconciliation must remain additive and must use a
new forward migration; never drop, truncate, or silently merge client data.
