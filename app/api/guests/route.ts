// app/api/guests/route.ts
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Guests from "@/models/guests";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// TypeScript type for Guest
type Guests = {
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
 * GET /api/guests
 * Fetch all guests
 */
export async function GET() {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const guests = await Guests.find({ userId: session.user.id });
    return NextResponse.json(guests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

/**
 * POST /api/guests
 * Create a new guest
 */
export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Attach logged-in userId
    const newGuest = await Guests.create({
      userId: session?.user?.id,
      guestName: body.guestName,
      contact: body.contact,
      meal: body.meal,
      rsvpStatus: body.rsvpStatus,
      table: body.table,
      dietaryRestrictions: body.dietaryRestrictions,
    });

    return NextResponse.json(newGuest, { status: 201 });
  } catch (error) {
    console.error("POST /guests error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
