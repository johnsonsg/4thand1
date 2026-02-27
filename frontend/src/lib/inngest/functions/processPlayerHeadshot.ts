import { inngest } from "@/lib/inngest/client";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { b2GetObjectBuffer, b2PutObjectBuffer } from "@/lib/b2/object";
import { removeBackgroundWithPhotoroom } from "@/lib/photoroom/removeBackground";
import sharp from "sharp";

type EventData = {
  tenantId: string;
  playerId: string;
  originalKey: string;
  uploadId: string;
};

type JsonBuffer = { type: "Buffer"; data: number[] };

function toBuffer(value: Buffer | JsonBuffer): Buffer {
  if (Buffer.isBuffer(value)) return value;
  // Inngest serialized Buffer form
  if (value && typeof value === "object" && (value as any).type === "Buffer" && Array.isArray((value as any).data)) {
    return Buffer.from((value as any).data);
  }
  throw new Error("Expected Buffer or serialized Buffer");
}

async function updateEmbeddedPlayerHeadshot(args: {
  tenantId: string;
  playerId: string;
  patch: Record<string, any>;
}) {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "tenant-settings",
    where: { tenantId: { equals: args.tenantId } },
    limit: 1,
    depth: 0,
  });

  const doc = result?.docs?.[0];
  if (!doc) throw new Error("TenantSettings not found");

  const players = Array.isArray((doc as any).players) ? [...(doc as any).players] : [];
  const idx = players.findIndex((p: any) => p?.id === args.playerId || p?.slug === args.playerId);

  if (idx === -1) throw new Error("Player not found in tenant players array");

  players[idx] = {
    ...players[idx],
    ...args.patch,
  };

  await payload.update({
    collection: "tenant-settings",
    id: (doc as any).id,
    data: { players },
  });
}

export const processPlayerHeadshot = inngest.createFunction(
  { id: "process-player-headshot", retries: 5 },
  { event: "player/headshot.uploaded" },
  async ({ event, step }) => {
    const data = event.data as EventData;
    const processedKey = `tenants/${data.tenantId}/players/${data.playerId}/headshot/processed/${data.uploadId}.png`;
    
    try {
      await step.run("mark-processing", async () => {
        await updateEmbeddedPlayerHeadshot({
          tenantId: data.tenantId,
          playerId: data.playerId,
          patch: { headshotStatus: "processing", headshotLastError: null },
        });
      });

      const originalBuf = toBuffer(
        await step.run("download-original", async () => b2GetObjectBuffer(data.originalKey))
      );

      const cutoutPng = toBuffer(
        await step.run("photoroom-remove-bg", async () => removeBackgroundWithPhotoroom(originalBuf))
      );

     const finalPng = cutoutPng;

      await step.run("upload-processed", async () => {
        await b2PutObjectBuffer(processedKey, finalPng, "image/png");
      });

      await step.run("mark-processed", async () => {
        await updateEmbeddedPlayerHeadshot({
          tenantId: data.tenantId,
          playerId: data.playerId,
          patch: { headshotProcessedKey: processedKey, headshotStatus: "processed" },
        });
      });

      return { ok: true, processedKey };
    } catch (err: any) {
      await updateEmbeddedPlayerHeadshot({
        tenantId: data.tenantId,
        playerId: data.playerId,
        patch: {
          headshotStatus: "failed",
          headshotLastError: err?.message ?? "Unknown error",
        },
      });

      throw err;
    }
  }
);