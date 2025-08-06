import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB as connectToDB } from "@/lib/mongodb";

export async function GET() {
  await connectToDB();
  const user = await User.findOne({ username: "admin" }); // Assuming you have a single admin user
  return NextResponse.json({ promptpayNumber: user?.promptpayNumber || "" });
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const { promptpayNumber } = await req.json();
  await User.findOneAndUpdate({ username: "admin" }, { promptpayNumber });
  return NextResponse.json({ message: "PromptPay number updated successfully." });
}
