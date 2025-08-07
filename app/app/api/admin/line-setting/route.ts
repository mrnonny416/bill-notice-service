
import { NextRequest, NextResponse } from 'next/server';
import { connectDB as dbConnect } from '@/lib/mongodb';
import Setting from '@/models/Setting';

export async function GET() {
  await dbConnect();
  try {
    const setting = await Setting.findOne({ key: 'lineId' });
    if (!setting) {
      return NextResponse.json({ success: false, message: 'Setting not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error', error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { value } = await req.json();
    const setting = await Setting.findOneAndUpdate(
      { key: 'lineId' },
      { value },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error', error }, { status: 500 });
  }
}
