import { NextRequest } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { resolveTenantFromHeaders } from "@/lib/tenancy/resolveTenant";
import { inngest } from "@/lib/inngest/client";

export const runtime = "nodejs"; // important (Payload + sharp + aws sdk patterns)

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });

  const tenantId = resolveTenantFromHeaders(req.headers);
  if (!tenantId) {
    return Response.json({ error: "Tenant not resolved" }, { status: 400 });
  }

  const { playerId, originalKey, uploadId } = await req.json();
  if (!playerId || !originalKey || !uploadId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await payload.find({
    collection: "tenant-settings",
    where: { tenantId: { equals: tenantId } },
    limit: 1,
    depth: 2,
  });

  const doc = result?.docs?.[0];
  if (!doc) {
    return Response.json({ error: "Tenant not found" }, { status: 404 });
  }

  const players = Array.isArray(doc.players) ? [...doc.players] : [];
  const idx = players.findIndex((p: any) => p?.id === playerId || p?.slug === playerId);

  if (idx === -1) {
    return Response.json({ error: "Player not found in tenant" }, { status: 404 });
  }

  players[idx] = {
    ...players[idx],
    headshotOriginalKey: originalKey,
    headshotUploadId: uploadId,
    headshotProcessedKey: null,
    headshotStatus: "queued",
    headshotLastError: null,
  };

  await payload.update({
    collection: "tenant-settings",
    id: doc.id,
    data: { players },
  });

  console.log("[headshot complete] sending inngest event", {
  tenantId,
  playerId,
  originalKey,
  uploadId,
});

  // Kick off async processing
  await inngest.send({
    name: "player/headshot.uploaded",
    data: {
      tenantId,
      playerId,
      originalKey,
      uploadId,
    },
  });

  console.log("[headshot complete] event sent");

  return Response.json({ ok: true });
}