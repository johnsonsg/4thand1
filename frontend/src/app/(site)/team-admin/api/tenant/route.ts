import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { resolveTenantFromClerkOrg } from '@/lib/tenancy/resolveTenantFromClerk';

function buildTenantRequest(tenantId: string) {
  return {
    headers: new Headers({ 'x-tenant-id': tenantId }),
  } as unknown as Request;
}

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!orgId) {
    return NextResponse.json({ error: 'No organization selected' }, { status: 400 });
  }

  const tenant = await resolveTenantFromClerkOrg(orgId);
  if (!tenant?.id || !tenant.tenantId) {
    return NextResponse.json({ error: 'Tenant not mapped for this organization' }, { status: 404 });
  }

  const payload = await getPayload({ config: configPromise });
  const doc = await payload.findByID({
    collection: 'tenant-settings',
    id: tenant.id,
    depth: 0,
    overrideAccess: true,
  });

  return NextResponse.json({ tenant: doc });
}

export async function PUT(request: Request) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!orgId) {
    return NextResponse.json({ error: 'No organization selected' }, { status: 400 });
  }

  const tenant = await resolveTenantFromClerkOrg(orgId);
  if (!tenant?.id || !tenant.tenantId) {
    return NextResponse.json({ error: 'Tenant not mapped for this organization' }, { status: 404 });
  }

  const data = (await request.json()) as Record<string, unknown>;
  const payload = await getPayload({ config: configPromise });

  const updatePayload = {
    brand: data.brand,
    nav: data.nav,
    metadata: data.metadata,
    contact: data.contact,
    hero: data.hero,
    theme: data.theme,
    stats: data.stats,
    schedule: data.schedule,
    players: data.players,
    news: data.news,
  } as Record<string, unknown>;

  const updated = await payload.update({
    collection: 'tenant-settings',
    id: tenant.id,
    data: updatePayload,
    overrideAccess: true,
    req: buildTenantRequest(tenant.tenantId),
  });

  return NextResponse.json({ tenant: updated });
}
