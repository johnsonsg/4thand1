import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { b2 } from "@/lib/b2s3";

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export async function b2GetObjectBuffer(key: string) {
  const res = await b2.send(
    new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: key,
    })
  );

  if (!res.Body) throw new Error("B2 GetObject returned empty body");
  return streamToBuffer(res.Body);
}

export async function b2PutObjectBuffer(key: string, body: Buffer, contentType: string) {
  await b2.send(
    new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return key;
}