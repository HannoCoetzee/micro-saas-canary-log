import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const canaries = await prisma.canary.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
    include: { entries: { orderBy: { createdAt: "desc" }, take: 5 } },
  });
  return NextResponse.json({ canaries });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name, statement, frequency } = await req.json();
    if (!name || !statement) {
      return NextResponse.json({ error: "Name and statement required" }, { status: 400 });
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") + "-" + Date.now().toString(36);
    const canary = await prisma.canary.create({
      data: {
        name,
        statement,
        slug,
        frequency: frequency || "weekly",
        userId: user.userId,
      },
    });
    return NextResponse.json({ canary });
  } catch (e) {
    console.error("Create canary error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
