import { NextResponse } from 'next/server';
import { getThemeConfig, saveThemeConfig } from '@/lib/theme/themeStore';

export async function GET() {
  const theme = await getThemeConfig();
  return NextResponse.json(theme);
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Body must be a JSON object.' }, { status: 400 });
  }

  await saveThemeConfig(body);
  return NextResponse.json({ ok: true });
}
