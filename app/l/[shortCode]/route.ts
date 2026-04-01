import { NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
): Promise<NextResponse> {
  const { shortCode } = await params;
  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(link.url);
  } catch {
    return NextResponse.json({ error: "Invalid redirect target" }, { status: 400 });
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return NextResponse.json({ error: "Invalid redirect target" }, { status: 400 });
  }

  return NextResponse.redirect(
    new URL(`/go/${shortCode}`, request.url),
    { status: 302 },
  );
}
