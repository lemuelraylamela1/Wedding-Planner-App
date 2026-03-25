// app/api/guests/[id]/route.ts
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Guests from "@/models/guests";

// TypeScript type for Guest
type Guest = {
  userId: string;
  guestName?: string;
  contact?: {
    email?: string;
    number?: string;
  };
  meal?: string;
  rsvpStatus?: "accepted" | "declined" | "pending" | "maybe";
  table?: number;
  dietaryRestrictions?: string;
};

/**
 * GET /api/guests/[id]
 * Fetch a single guest by ID
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();
    const guest = await Guests.findById(params.id);
    if (!guest)
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    return NextResponse.json(guest, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

/**
 * PATCH /api/guests/[id]
 * Update guest by ID
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();
    const body: Partial<Guest> = await req.json();
    const updatedGuest = await Guests.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updatedGuest)
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    return NextResponse.json(updatedGuest, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

/**
 * DELETE /api/guests/[id]
 * Delete guest by ID
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();
    const deletedGuest = await Guests.findByIdAndDelete(params.id);
    if (!deletedGuest)
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    return NextResponse.json(
      { message: "Guest deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
