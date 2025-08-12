import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LinkModel from "@/models/Link";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as DecodedToken;
    const userId = decodedToken.userId;

    const body = await req.json();
    const {
      name,
      amount,
      status,
      outStandingBalance,
      dueDate,
      previousQuota,
      currentQuota,
      nextQuota,
      extraQuota,
    } = body;

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
      outStandingBalance,
      dueDate,
      previousQuota,
      currentQuota,
      nextQuota,
      extraQuota,
      createdBy: userId,
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const query: { createdBy?: string } = {};
  if (userId) {
    query.createdBy = userId;
  }

  const links = await LinkModel.find(query)
    .populate("createdBy", "username")
    .sort({ createdAt: -1 });
  return NextResponse.json(links);
}

