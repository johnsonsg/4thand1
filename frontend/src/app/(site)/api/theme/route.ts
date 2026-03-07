import { NextResponse } from 'next/server';
import { getThemeConfig, saveThemeConfig } from '@/lib/theme/themeStore';
import { resolveTenantFromRequestAsync } from '@/lib/tenancy/resolveTenant';

export async function GET(request: Request) {
  const tenantId = await resolveTenantFromRequestAsync(request);
  const theme = await getThemeConfig(tenantId);
  return NextResponse.json(theme);
}

export async function PUT(request: Request) {
  const tenantId = await resolveTenantFromRequestAsync(request);
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Body must be a JSON object.' }, { status: 400 });
  }

  await saveThemeConfig(body, tenantId);
  return NextResponse.json({ ok: true });
}
