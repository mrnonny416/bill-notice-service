import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { LinkModel } from "@/models/Link";

// GET /api/link/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const doc = await LinkModel.findById(id);
  if (!doc) {
    return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
  }
  return NextResponse.json(doc);
}

// PATCH /api/link/[id]
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const body = await req.json();

  const update: Partial<{
    slip: string;
    slipUploadedAt: Date;
    status: string;
    statusChangedAt: Date;
    paidMessage: string; // เพิ่มตรงนี้
  }> = {};

  if (typeof body.slip !== "undefined") update.slip = body.slip;
  if (typeof body.slipUploadedAt !== "undefined")
    update.slipUploadedAt = new Date(body.slipUploadedAt);
  if (typeof body.status !== "undefined") update.status = body.status;
  if (typeof body.statusChangedAt !== "undefined")
    update.statusChangedAt = new Date(body.statusChangedAt);
  if (typeof body.paidMessage !== "undefined") update.paidMessage = body.paidMessage; // เพิ่มตรงนี้

  const doc = await LinkModel.findByIdAndUpdate(id, update, { new: true });
  if (!doc) {
    return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
  }
  return NextResponse.json(doc);
}
