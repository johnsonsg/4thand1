
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { b2 } from "@/lib/b2s3";
import { randomUUID } from "crypto";
import { resolveTenantFromHeaders } from "@/lib/tenancy/resolveTenant";

const ALLOWED_PURPOSES = ["PLAYER_HEADSHOT", "GENERAL"] as const;
type Purpose = (typeof ALLOWED_PURPOSES)[number];


export const presignUpload = async (req: any) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();
  const {
    purpose,
    playerId,
    contentType = "image/jpeg",
  }: {
    purpose: Purpose;
    playerId?: string;
    contentType?: string;
  } = body;

  if (!ALLOWED_PURPOSES.includes(purpose)) {
    return Response.json({ error: "Invalid purpose" }, { status: 400 });
  }

  // Derive tenantId from headers (never from client input)
  const tenantId = resolveTenantFromHeaders(req.headers);
  if (!tenantId) {
    return Response.json({ error: "Tenant not resolved" }, { status: 400 });
  }

  if (purpose === "PLAYER_HEADSHOT" && !playerId) {
    return Response.json(
      { error: "playerId required for PLAYER_HEADSHOT" },
      { status: 400 }
    );
  }

  const ext =
    contentType.includes("png") ? "png"
    : contentType.includes("webp") ? "webp"
    : "jpg";

  let key: string;
  let uploadId: string | undefined;

  if (purpose === "PLAYER_HEADSHOT") {
    uploadId = randomUUID();
    key = `tenants/${tenantId}/players/${playerId}/headshot/original/${uploadId}.${ext}`;
  } else {
    key = `uploads/general/${randomUUID()}.${ext}`;
  }

  const cmd = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(b2, cmd, { expiresIn: 300 });

  return Response.json({ uploadUrl, key, uploadId });
};
