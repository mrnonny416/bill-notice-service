import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { LinkModel } from "@/models/Link";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, amount, status } = body;

    if (!name || !amount || !status) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    const doc = await LinkModel.create({
      name,
      amount,
      status,
      slip: null,
      slipUploadedAt: null,
      statusChangedAt: null,
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const links = await LinkModel.find().sort({ createdAt: -1 });
  return NextResponse.json(links);
}