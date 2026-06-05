import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { message, signature } = await req.json();
  const canary = await prisma.canary.findFirst({
    where: { id, userId: user.userId },
  });
  if (!canary) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const entry = await prisma.canaryEntry.create({
    data: {
      canaryId: id,
      message: message || canary.statement,
      signature,
    },
  });
  await prisma.canary.update({
    where: { id },
    data: { lastSigned: new Date() },
  });
  return NextResponse.json({ entry });
}
