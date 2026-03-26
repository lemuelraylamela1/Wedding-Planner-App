import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import WeddingDayEvent from "@/models/wedding-day-event";

export async function GET() {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  const events = await WeddingDayEvent.find({
    userId: session?.user?.id,
  }).sort({ time: 1 });

  return NextResponse.json(events);
}

export async function POST(req: Request) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);
  const body = await req.json();

  const event = await WeddingDayEvent.create({
    ...body,
    userId: session?.user?.id,
  });

  return NextResponse.json(event);
}
