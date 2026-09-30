// Build-time reader for the gateway's API contract. The "API at a glance" list and
// the JSON response example are generated from gateway/api/openapi.yaml (the snapshot) —
// never hand-written (website/PLAN.md §4). Server components call this while the
// static export is generated.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";

export type ApiOperation = { method: string; path: string; summary: string };
export type ApiGroup = { tag: string; description: string; operations: ApiOperation[] };

// Public, application-facing tags only. "Provider callbacks" and "Admin" are
// deliberately excluded (website/PLAN.md §9: no admin or provider-callback routes).
const PUBLIC_TAGS = ["Payments", "Refunds", "Payouts", "Ledger", "Exports", "Events", "Meta"];

const METHODS = ["get", "post", "put", "patch", "delete"] as const;

let cache: ReturnType<typeof parseOpenApi> | undefined;

function parseOpenApi() {
  // The gateway snapshot (scripts/gateway.mjs); `npm run sync:gateway` refreshes it.
  const yoonAppDir = resolve(process.env.YOON_APP_DIR ?? "gateway");
  const file = join(yoonAppDir, "api/openapi.yaml");
  let doc: any;
  try {
    doc = parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(
      `[openapi] Cannot read ${file}. The API list comes from the gateway snapshot:\n` +
        `run \`npm run sync:gateway\`.\n${String(error)}`,
    );
  }

  const tagDescriptions: Record<string, string> = {};
  for (const tag of doc.tags ?? []) tagDescriptions[tag.name] = tag.description ?? "";

  const groups: ApiGroup[] = PUBLIC_TAGS.map((tag) => ({
    tag,
    description: tagDescriptions[tag] ?? "",
    operations: [],
  }));
  const byTag = new Map(groups.map((g) => [g.tag, g]));

  for (const [path, pathItem] of Object.entries<any>(doc.paths ?? {})) {
    for (const method of METHODS) {
      const op = pathItem[method];
      if (!op) continue;
      for (const tag of op.tags ?? []) {
        byTag
          .get(tag)
          ?.operations.push({ method: method.toUpperCase(), path, summary: op.summary ?? "" });
      }
    }
  }
  return { doc, groups };
}

/** The endpoint list, grouped by tag, in contract order. */
export function apiGroups(): ApiGroup[] {
  cache ??= parseOpenApi();
  return cache.groups;
}

/** The `Payment` schema from the contract (the 201 response of `POST /v1/payments`). */
export function paymentSchema(): any {
  cache ??= parseOpenApi();
  return cache.doc.components?.schemas?.Payment;
}

/**
 * A 201 response example for POST /v1/payments, built from the contract. Fields are
 * looked up in the schema first — if the contract drops or renames one, the build
 * fails here instead of the site lying.
 */
export function paymentResponseExample(): object {
  const schema = paymentSchema();
  if (!schema) throw new Error("[openapi] api/openapi.yaml has no Payment schema");
  const properties: Record<string, any> = schema.properties ?? {};

  const wanted: Record<string, unknown> = {
    id: "pay_0199a3f0c2e47a1b9c3d5e6f7a8b9c0d",
    object: "payment",
    status: "pending",
    amount: 5000,
    amount_refunded: 0,
    currency: "XOF",
    country: "SN",
    method: "wave",
    reference: "order_1042",
    customer: { phone: "+22177***67" },
    provider: "paydunya",
    checkout_url: "https://checkout.provider.example/pay/…",
    created_at: "2026-09-30T10:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  };

  for (const [field, path] of [
    ["customer", "customer"],
    ["checkout_url", "checkout_url"],
  ] as const) {
    if (!properties[field])
      throw new Error(
        `[openapi] Payment schema no longer has "${path}" — update the website's response example`,
      );
  }
  const required: string[] = schema.required ?? [];
  for (const field of Object.keys(wanted)) {
    if (!properties[field])
      throw new Error(
        `[openapi] Payment schema no longer has "${field}" — update the website's response example`,
      );
  }
  for (const field of required) {
    if (!(field in wanted)) {
      throw new Error(
        `[openapi] Payment schema requires "${field}", which the website's response example omits`,
      );
    }
  }
  // customer.phone is masked in responses (contract: "Phone numbers are returned masked")
  return wanted;
}
