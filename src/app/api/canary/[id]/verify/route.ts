import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const canary = await prisma.canary.findUnique({
    where: { id },
    include: { entries: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!canary) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ canary });
}
