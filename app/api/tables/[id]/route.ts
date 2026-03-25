// app/api/tables/[id]/route.ts

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Tables } from "@/models/table";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { number, capacity } = body;

    const updated = await Tables.findByIdAndUpdate(
      id,
      { number, capacity },
      { returnDocument: "after" }, // ✅ fixed mongoose warning
    );

    if (!updated) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update table" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectMongoDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await Tables.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Table deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete table" },
      { status: 500 },
    );
  }
}
