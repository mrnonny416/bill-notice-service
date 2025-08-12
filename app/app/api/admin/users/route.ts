import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as DecodedToken;

    const users = await User.find({}, "_id username");
    return NextResponse.json(users, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
