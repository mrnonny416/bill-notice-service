import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB as connectToDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

// Helper function for token verification
const verifyToken = (req: NextRequest) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    throw new Error("Unauthorized");
  }
  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
};

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    verifyToken(req); // Verify token

    const user = await User.findOne({ username: "admin" }); // Assuming a single admin user
    return NextResponse.json({ promptpayNumber: user?.promptpayNumber || "" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = errorMessage === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    verifyToken(req); // Verify token

    const { promptpayNumber } = await req.json();
    await User.findOneAndUpdate({ username: "admin" }, { promptpayNumber });
    return NextResponse.json({ message: "PromptPay number updated successfully." });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = errorMessage === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}