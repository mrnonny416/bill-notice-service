import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'

export async function GET() {
  try {
    await connectDB()
    return NextResponse.json({ message: '✅ MongoDB Connected' })
  } catch (error) {
    return NextResponse.json(
      { message: '❌ MongoDB Connection Failed', error: String(error) },
      { status: 500 }
    )
  }
}
