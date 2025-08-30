
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB as connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Helper function for token verification
const verifyToken = (req: NextRequest) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    throw new Error("Unauthorized");
  }
  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
};

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    verifyToken(req); // Verify token

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const status = errorMessage === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}
