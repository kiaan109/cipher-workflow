import { NextRequest, NextResponse } from "next/server";
import { getBandMessages } from "@/lib/band";
import { requireAuth } from "@/lib/auth-utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  await requireAuth();
  const { roomId } = await params;
  const messages = await getBandMessages(roomId);
  return NextResponse.json({ messages });
}
