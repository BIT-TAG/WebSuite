import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { readAppsData, writeAppsData } from '@/lib/storage';
import { CreateAppSchema, AppsDataSchema } from '@/lib/schemas';

export async function GET() {
  try {
    const data = await readAppsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading apps data:', error);
    return NextResponse.json(
      { error: 'Failed to read apps data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedApp = CreateAppSchema.parse(body);
    
    const data = await readAppsData();
    const newApp = {
      ...validatedApp,
      id: nanoid(),
    };
    
    data.apps.push(newApp);
    await writeAppsData(data);
    
    return NextResponse.json(newApp, { status: 201 });
  } catch (error) {
    console.error('Error creating app:', error);
    return NextResponse.json(
      { error: 'Failed to create app' },
      { status: 400 }
    );
  }
}