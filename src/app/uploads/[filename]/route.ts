import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (filename.includes("..") || filename.includes("/")) {
    return new NextResponse(null, { status: 400 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    return new NextResponse(null, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    await stat(filePath);
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  const file = await readFile(filePath);

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
