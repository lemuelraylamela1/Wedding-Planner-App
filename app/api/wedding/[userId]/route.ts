import { connectMongoDB } from "@/lib/mongodb";
import Wedding from "@/models/wedding-details";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
  try {
    await connectMongoDB();

    const wedding = await Wedding.findOne({ userId: params.userId });

    return NextResponse.json(wedding);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch wedding" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ userId: string }> },
) {
  const params = await props.params;
  try {
    await connectMongoDB();

    const body = await req.json();

    const wedding = await Wedding.findOneAndUpdate(
      { userId: params.userId },
      {
        brideName: body.brideName,
        groomName: body.groomName,
        date: body.date,
        location: body.location,
        theme: body.theme,
        guestCount: body.guestCount,
        budget: body.budget,
        ceremonyTime: body.ceremonyTime,
        receptionTime: body.receptionTime,
        guestArrival: body.guestArrival,
      },
      { new: true, upsert: true },
    );

    return NextResponse.json(wedding);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save wedding" },
      { status: 500 },
    );
  }
}
