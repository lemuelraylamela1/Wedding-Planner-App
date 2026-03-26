// app/api/guests/[id]/route.ts
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Suppliers from "@/models/supplier";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/guests/:id
 * Fetch a single guest by ID
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectMongoDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Supplier ID is required" },
        { status: 400 },
      );
    }

    const supplier = await Suppliers.findById(id);

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(supplier, { status: 200 });
  } catch (error) {
    console.error("GET /suppliers/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/guests/:id
 * Update a guest by ID
 */
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
        { error: "Supplier ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    // Update only the fields provided
    const updatedSupplier = await Suppliers.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });

    if (!updatedSupplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedSupplier, { status: 200 });
  } catch (error) {
    console.error("PATCH /suppliers/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/guests/:id
 * Delete a guest by ID
 */
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
        { error: "Supplier ID is required" },
        { status: 400 },
      );
    }

    const deletedSupplier = await Suppliers.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Supplier deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /suppliers/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
