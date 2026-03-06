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

export async function POST(request: Request) {
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

  const formData = await request.formData();
  const file = formData.get('file');
  const alt = (formData.get('alt') ?? 'Team upload').toString();

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  const arrayBuffer = await (file as File).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = (file as File).name || 'upload';
  const mimeType = (file as File).type || 'application/octet-stream';

  const payload = await getPayload({ config: configPromise });
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: buffer,
      name: filename,
      mimetype: mimeType,
      size: buffer.length,
    },
    overrideAccess: true,
    req: buildTenantRequest(tenant.tenantId),
  } as any);

  return NextResponse.json({ media });
}
