
import { NextResponse } from 'next/server';
import { connectDB as dbConnect } from '@/lib/mongodb';
import Setting from '@/models/Setting';

// This is a public endpoint to fetch the Line setting.
export async function GET() {
  try {
    await dbConnect();
    const setting = await Setting.findOne({ key: 'lineId' });
    
    if (!setting) {
      // It's better to return a default/empty value for a public config endpoint
      return NextResponse.json({ success: true, data: { key: 'lineId', value: '' } });
    }
    
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error("Error fetching line setting:", error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
