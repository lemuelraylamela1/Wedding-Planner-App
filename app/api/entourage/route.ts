import { NextResponse } from "next/server";
import Entourage from "@/models/entourage";
import { connectMongoDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entourage = await Entourage.find({ userId: session.user.id });
    return NextResponse.json(entourage);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch entourage" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const newEntourage = await Entourage.create(body);
    return NextResponse.json(newEntourage);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create entourage" },
      { status: 500 },
    );
  }
}
