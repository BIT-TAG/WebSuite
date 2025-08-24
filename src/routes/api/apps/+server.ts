import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllApps, addApp } from '$lib/server/storage';
import { CreateAppSchema } from '$lib/schemas/app';
import { requireAdmin } from '$lib/server/auth';

export const GET: RequestHandler = async ({ request }) => {
  try {
    await requireAdmin(request);
    const apps = await getAllApps();
    return json(apps);
  } catch (err) {
    console.error('Failed to load apps:', err);
    throw error(500, 'Failed to load apps');
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validatedData = CreateAppSchema.parse(body);
    
    const newApp = await addApp({
      ...validatedData,
      kind: 'app' as const,
      status: 'Installiert',
      pos: validatedData.pos || { x: 0, y: 0 },
      dim: { w: 1, h: 1 }, // Apps are always 1x1
      widgets: []
    });
    
    return json(newApp, { status: 201 });
  } catch (err) {
    console.error('Failed to create app:', err);
    if (err instanceof Error && err.message.includes('validation')) {
      throw error(400, 'Invalid app data');
    }
    throw error(500, 'Failed to create app');
  }
};