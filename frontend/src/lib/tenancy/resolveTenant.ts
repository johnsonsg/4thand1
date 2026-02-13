const FALLBACK_TENANT = process.env.DEFAULT_TENANT_ID ?? 'default';

function normalizeHost(host: string | null): string {
  if (!host) return '';
  return host.split(',')[0]?.trim().toLowerCase().split(':')[0] ?? '';
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

export function resolveTenantFromRequest(request: Request): string {
  return resolveTenantFromHeaders(request.headers);
}
