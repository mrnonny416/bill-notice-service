
import { NextRequest, NextResponse } from 'next/server';
import { connectDB as dbConnect } from '@/lib/mongodb';
import Setting from '@/models/Setting';
import jwt from 'jsonwebtoken';

// Helper function for token verification
const verifyToken = (req: NextRequest) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    throw new Error("Unauthorized");
  }
  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
};

// The GET handler has been moved to a public route at /api/line-setting

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    verifyToken(req); // Verify token

    const { value } = await req.json();
    const setting = await Setting.findOneAndUpdate(
      { key: 'lineId' },
      { value },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = errorMessage === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ success: false, message: errorMessage }, { status });
  }
}
