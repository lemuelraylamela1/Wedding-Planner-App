import { NextResponse } from "next/server";
import Suppliers from "@/models/supplier";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectMongoDB();
    const suppliers = await Suppliers.find({});
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const body = await req.json();
    const newSupplier = await Suppliers.create(body);
    return NextResponse.json(newSupplier);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 },
    );
  }
}
