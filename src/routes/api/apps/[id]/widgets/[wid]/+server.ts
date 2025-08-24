import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAppById, updateApp } from '$lib/server/storage';
import { UpdateWidgetSchema } from '$lib/schemas/app';
import { requireAdmin } from '$lib/server/auth';

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validatedData = UpdateWidgetSchema.parse(body);
    
    const app = await getAppById(params.id);
    if (!app) {
      throw error(404, 'App not found');
    }
    
    const widgetIndex = app.widgets.findIndex(w => w.id === params.wid);
    if (widgetIndex === -1) {
      throw error(404, 'Widget not found');
    }
    
    const updatedWidget = {
      ...app.widgets[widgetIndex],
      ...validatedData,
      id: params.wid, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    const updatedWidgets = [...app.widgets];
    updatedWidgets[widgetIndex] = updatedWidget;
    
    const updatedApp = await updateApp(params.id, {
      widgets: updatedWidgets
    });
    
    if (!updatedApp) {
      throw error(500, 'Failed to update widget');
    }
    
    return json(updatedWidget);
  } catch (err) {
    console.error('Failed to update widget:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    if (err instanceof Error && err.message.includes('validation')) {
      throw error(400, 'Invalid widget data');
    }
    throw error(500, 'Failed to update widget');
  }
};

export const DELETE: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    
    const app = await getAppById(params.id);
    if (!app) {
      throw error(404, 'App not found');
    }
    
    const widgetExists = app.widgets.some(w => w.id === params.wid);
    if (!widgetExists) {
      throw error(404, 'Widget not found');
    }
    
    const updatedWidgets = app.widgets.filter(w => w.id !== params.wid);
    
    const updatedApp = await updateApp(params.id, {
      widgets: updatedWidgets
    });
    
    if (!updatedApp) {
      throw error(500, 'Failed to delete widget');
    }
    
    return json({ success: true });
  } catch (err) {
    console.error('Failed to delete widget:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    throw error(500, 'Failed to delete widget');
  }
};