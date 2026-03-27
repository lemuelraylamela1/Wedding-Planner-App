// app/api/guests/[id]/route.ts
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Entourage from "@/models/entourage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectMongoDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Entourage ID is required" },
        { status: 400 },
      );
    }

    const entourage = await Entourage.findById(id);

    if (!entourage) {
      return NextResponse.json(
        { error: "Entourage not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(entourage, { status: 200 });
  } catch (error) {
    console.error("GET /entourage/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Entourage ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    // Update only the fields provided
    const updatedEntourage = await Entourage.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });

    if (!updatedEntourage) {
      return NextResponse.json(
        { error: "Entourage not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedEntourage, { status: 200 });
  } catch (error) {
    console.error("PATCH /entourage/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectMongoDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Entourage ID is required" },
        { status: 400 },
      );
    }

    const deletedEntourage = await Entourage.findByIdAndDelete(id);

    if (!deletedEntourage) {
      return NextResponse.json(
        { error: "Entourage not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Entourage deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /entourage/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
