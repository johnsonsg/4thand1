import configPromise from '@payload-config';
import { getPayload } from 'payload';

export type TenantLookup = {
  id: string;
  tenantId: string | null | undefined;
  clerkOrgId?: string | null;
};

export async function resolveTenantFromClerkOrg(orgId: string): Promise<TenantLookup | null> {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'tenant-settings',
    where: { clerkOrgId: { equals: orgId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const doc = result.docs?.[0] as TenantLookup | undefined;
  return doc ?? null;
}
