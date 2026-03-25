// app/api/tables/route.ts

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Tables } from "@/models/table";

export async function GET() {
  try {
    await connectMongoDB();

    const tables = await Tables.find().sort({ number: 1 });

    return NextResponse.json(tables);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { number, capacity } = body;

    if (!number || !capacity) {
      return NextResponse.json(
        { error: "Table number and capacity are required" },
        { status: 400 },
      );
    }

    const existing = await Tables.findOne({ number });
    if (existing) {
      return NextResponse.json(
        { error: "Table already exists" },
        { status: 400 },
      );
    }

    const table = await Tables.create({
      number,
      capacity,
      guests: [],
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create table" },
      { status: 500 },
    );
  }
}
