import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LinkModel, { ILink } from "@/models/Link";

// GET /api/link/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    const doc = await LinkModel.findById(id).populate(
      "createdBy",
      "promptpayNumber",
    );
    if (!doc) {
      return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
    }

    if (!doc.qrAccessedAt) {
      doc.qrAccessedAt = new Date();
      await doc.save();
    }

    return NextResponse.json(doc);
  } catch (error) {
    console.error("Error fetching link data:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }, { status: 500 });
  }
}

// PATCH /api/link/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();

    // Create a type-safe update object
    const update: Partial<ILink> = {};

    if (typeof body.slip !== "undefined") update.slip = body.slip;
    if (typeof body.slipUploadedAt !== "undefined")
      update.slipUploadedAt = new Date(body.slipUploadedAt);
    if (typeof body.status !== "undefined") update.status = body.status;
    if (typeof body.statusChangedAt !== "undefined")
      update.statusChangedAt = new Date(body.statusChangedAt);
    if (typeof body.paidMessage !== "undefined") update.paidMessage = body.paidMessage;
    if (typeof body.transactionId !== "undefined") update.transactionId = body.transactionId;

    const doc = await LinkModel.findByIdAndUpdate(id, update, { new: true });
    if (!doc) {
      return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (error) {
    console.error("Error updating link data:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" }, { status: 500 });
  }
}