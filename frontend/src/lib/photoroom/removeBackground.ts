export async function removeBackgroundWithPhotoroom(input: Buffer) {
  const fd = new FormData();

  const bytes = new Uint8Array(input);
  const blob = new Blob([bytes], { type: "image/jpeg" });

  fd.append("image_file", blob, "headshot.jpg");
  fd.append("format", "png");
  fd.append("crop", "true");

  const res = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: {
      "x-api-key": process.env.PHOTOROOM_API_KEY!,
    },
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Photoroom failed: ${res.status} ${text}`);
  }

  return Buffer.from(await res.arrayBuffer());
}