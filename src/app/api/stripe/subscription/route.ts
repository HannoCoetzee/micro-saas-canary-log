import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: undefined as any });
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { stripeCustomerId: true } });
    if (!dbUser?.stripeCustomerId) return NextResponse.json({ error: "No subscription" }, { status: 404 });
    const subs = await stripe.subscriptions.list({ customer: dbUser.stripeCustomerId as string, status: "active" });
    for (const sub of subs.data) {
      await stripe.subscriptions.cancel(sub.id);
    }
    await prisma.user.update({ where: { id: user.userId }, data: { subscriptionStatus: "canceled" } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Cancel error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
