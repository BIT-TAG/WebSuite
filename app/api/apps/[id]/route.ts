import { NextRequest, NextResponse } from 'next/server';
import { readAppsData, writeAppsData, findAppById } from '@/lib/storage';
import { UpdateAppSchema } from '@/lib/schemas';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = await findAppById(params.id);
    
    if (!app) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(app);
  } catch (error) {
    console.error('Error reading app:', error);
    return NextResponse.json(
      { error: 'Failed to read app' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedApp = UpdateAppSchema.parse({ ...body, id: params.id });
    
    const data = await readAppsData();
    const appIndex = data.apps.findIndex(app => app.id === params.id);
    
    if (appIndex === -1) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }
    
    // Merge existing app with updates
    data.apps[appIndex] = { ...data.apps[appIndex], ...validatedApp };
    await writeAppsData(data);
    
    return NextResponse.json(data.apps[appIndex]);
  } catch (error) {
    console.error('Error updating app:', error);
    return NextResponse.json(
      { error: 'Failed to update app' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await readAppsData();
    const appIndex = data.apps.findIndex(app => app.id === params.id);
    
    if (appIndex === -1) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }
    
    const deletedApp = data.apps.splice(appIndex, 1)[0];
    await writeAppsData(data);
    
    return NextResponse.json(deletedApp);
  } catch (error) {
    console.error('Error deleting app:', error);
    return NextResponse.json(
      { error: 'Failed to delete app' },
      { status: 500 }
    );
  }
}