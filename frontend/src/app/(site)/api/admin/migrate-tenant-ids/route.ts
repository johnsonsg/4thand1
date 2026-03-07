import { NextResponse } from "next/server";
import configPromise from "@payload-config";
import { getPayload } from "payload";

const TOKEN_ENV = "TENANT_MIGRATION_TOKEN";

type TenantSettingsDoc = {
  id: string;
  tenantId?: string | null;
  clerkOrgId?: string | null;
};

type TenantDomainDoc = {
  id: string;
  tenantId?: string | null;
};

export async function POST(request: Request) {
  const expectedToken = process.env[TOKEN_ENV];
  if (!expectedToken) {
    return NextResponse.json(
      { error: `Missing ${TOKEN_ENV} env var` },
      { status: 500 }
    );
  }

  const providedToken = request.headers.get("x-migration-token");
  if (!providedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "tenant-settings",
    where: { clerkOrgId: { exists: true } },
    depth: 0,
    limit: 200,
    overrideAccess: true,
  });

  const docs = (result.docs ?? []) as TenantSettingsDoc[];
  const updates: Array<{ id: string; from: string; to: string }> = [];

  for (const doc of docs) {
    const orgId = doc.clerkOrgId?.trim();
    const currentTenantId = doc.tenantId?.trim();
    if (!orgId) continue;
    if (currentTenantId === orgId) continue;

    await payload.update({
      collection: "tenant-settings",
      id: doc.id,
      data: { tenantId: orgId },
      overrideAccess: true,
    });

    if (currentTenantId) {
      updates.push({ id: doc.id, from: currentTenantId, to: orgId });
    } else {
      updates.push({ id: doc.id, from: "(empty)", to: orgId });
    }
  }

  let domainUpdates = 0;
  for (const change of updates) {
    if (!change.from || change.from === "(empty)") continue;
    const domainResult = await payload.find({
      collection: "tenant-domains",
      where: { tenantId: { equals: change.from } },
      depth: 0,
      limit: 200,
      overrideAccess: true,
    });

    const domains = (domainResult.docs ?? []) as TenantDomainDoc[];
    for (const domain of domains) {
      await payload.update({
        collection: "tenant-domains",
        id: domain.id,
        data: { tenantId: change.to },
        overrideAccess: true,
      });
      domainUpdates += 1;
    }
  }

  return NextResponse.json({
    updatedTenants: updates.length,
    updatedTenantDomains: domainUpdates,
    changes: updates,
  });
}
