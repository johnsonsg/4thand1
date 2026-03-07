import configPromise from '@payload-config';
import { getPayload } from 'payload';

const FALLBACK_TENANT = process.env.DEFAULT_TENANT_ID ?? 'default';

function normalizeHost(host: string | null): string {
  if (!host) return '';
  return host.split(',')[0]?.trim().toLowerCase().split(':')[0] ?? '';
}

async function lookupTenantFromDomain(domain: string): Promise<string | null> {
  if (!domain) return null;
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'tenant-domains',
    where: { domain: { equals: domain }, status: { equals: 'active' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const doc = result.docs?.[0] as { tenantId?: string | null } | undefined;
  return doc?.tenantId ?? null;
}

export function resolveTenantFromHeaders(headers: Headers): string {
  const headerTenant = headers.get('x-tenant-id')?.trim();
  if (headerTenant) return headerTenant;

  const host = normalizeHost(headers.get('x-forwarded-host') ?? headers.get('host'));
  if (!host) return FALLBACK_TENANT;

  if (host === 'localhost' || host.endsWith('.localhost')) {
    return FALLBACK_TENANT;
  }

  const parts = host.split('.');
  if (parts.length > 2) {
    return parts[0] ?? FALLBACK_TENANT;
  }

  return FALLBACK_TENANT;
}

export async function resolveTenantFromHeadersAsync(headers: Headers): Promise<string> {
  const headerTenant = headers.get('x-tenant-id')?.trim();
  if (headerTenant) return headerTenant;

  const host = normalizeHost(headers.get('x-forwarded-host') ?? headers.get('host'));
  if (!host) return FALLBACK_TENANT;

  if (host === 'localhost' || host.endsWith('.localhost')) {
    return FALLBACK_TENANT;
  }

  const mapped = await lookupTenantFromDomain(host);
  if (mapped) return mapped;

  const parts = host.split('.');
  if (parts.length > 2) {
    return parts[0] ?? FALLBACK_TENANT;
  }

  return FALLBACK_TENANT;
}

export function resolveTenantFromRequest(request: Request): string {
  return resolveTenantFromHeaders(request.headers);
}

export async function resolveTenantFromRequestAsync(request: Request): Promise<string> {
  return resolveTenantFromHeadersAsync(request.headers);
}
