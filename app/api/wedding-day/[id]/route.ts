import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import WeddingDayEvent from "@/models/wedding-day-event";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await connectMongoDB();

  const { id } = await context.params; // ✅ THIS IS THE FIX
  const body = await req.json();

  const updated = await WeddingDayEvent.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  await connectMongoDB();

  const { id } = await context.params; // ✅ same here
  await WeddingDayEvent.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
