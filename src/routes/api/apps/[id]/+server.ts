import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAppById, updateApp, deleteApp } from '$lib/server/storage';
import { UpdateAppSchema } from '$lib/schemas/app';
import { requireAdmin } from '$lib/server/auth';

export const GET: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const app = await getAppById(params.id);
    
    if (!app) {
      throw error(404, 'App not found');
    }
    
    return json(app);
  } catch (err) {
    console.error('Failed to load app:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    throw error(500, 'Failed to load app');
  }
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validatedData = UpdateAppSchema.parse(body);
    
    const updatedApp = await updateApp(params.id, validatedData);
    
    if (!updatedApp) {
      throw error(404, 'App not found');
    }
    
    return json(updatedApp);
  } catch (err) {
    console.error('Failed to update app:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    if (err instanceof Error && err.message.includes('validation')) {
      throw error(400, 'Invalid app data');
    }
    throw error(500, 'Failed to update app');
  }
};

export const DELETE: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const deleted = await deleteApp(params.id);
    
    if (!deleted) {
      throw error(404, 'App not found');
    }
    
    return json({ success: true });
  } catch (err) {
    console.error('Failed to delete app:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    throw error(500, 'Failed to delete app');
  }
};