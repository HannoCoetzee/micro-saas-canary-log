import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, authCookieHeader } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash },
      select: { id: true, email: true },
    });
    const token = await signToken({ userId: user.id, email: user.email });
    return NextResponse.json(
      { user },
      { headers: { "Set-Cookie": authCookieHeader(token) } }
    );
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
