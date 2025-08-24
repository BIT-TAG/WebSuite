import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAppById, updateApp } from '$lib/server/storage';
import { CreateWidgetSchema, type Widget } from '$lib/schemas/app';
import { requireAdmin } from '$lib/server/auth';

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validatedData = CreateWidgetSchema.parse(body);
    
    const app = await getAppById(params.id);
    if (!app) {
      throw error(404, 'App not found');
    }
    
    const newWidget: Widget = {
      id: crypto.randomUUID(),
      title: validatedData.title,
      kind: 'widget',
      widgetType: validatedData.widgetType,
      content: validatedData.content,
      pos: validatedData.pos || { x: 0, y: 0 },
      dim: validatedData.dim || { w: 2, h: 2 },
      visible: validatedData.visible ?? true,
      color: validatedData.color || 'blue',
      props: validatedData.props || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedApp = await updateApp(params.id, {
      widgets: [...app.widgets, newWidget]
    });
    
    if (!updatedApp) {
      throw error(500, 'Failed to add widget');
    }
    
    return json(newWidget, { status: 201 });
  } catch (err) {
    console.error('Failed to create widget:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    if (err instanceof Error && err.message.includes('validation')) {
      throw error(400, 'Invalid widget data');
    }
    throw error(500, 'Failed to create widget');
  }
};