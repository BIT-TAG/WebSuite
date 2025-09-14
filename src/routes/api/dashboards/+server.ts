import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadDashboardStructure, addDashboardNode } from '$lib/server/dashboards';
import { CreateDashboardSchema } from '$lib/schemas/dashboard';
import { requireAdmin } from '$lib/server/auth';

export const GET: RequestHandler = async ({ request }) => {
  try {
    await requireAdmin(request);
    const structure = await loadDashboardStructure();
    return json(structure);
  } catch (err) {
    console.error('Failed to load dashboard structure:', err);
    throw error(500, 'Failed to load dashboard structure');
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validatedData = CreateDashboardSchema.parse(body);
    
    // Calculate position for new node
    const position = {
      x: Math.random() * 400 - 200,
      y: Math.random() * 200 + 100
    };
    
    const newNode = await addDashboardNode({
      name: validatedData.name,
      type: validatedData.type,
      description: validatedData.description,
      icon: validatedData.icon,
      color: validatedData.color,
      parentId: validatedData.parentId,
      children: [],
      position,
      config: {
        widgets: [],
        layout: 'grid',
        permissions: {
          view: ['*'],
          edit: ['user'],
          admin: ['admin']
        }
      }
    });
    
    return json(newNode, { status: 201 });
  } catch (err) {
    console.error('Failed to create dashboard:', err);
    if (err instanceof Error && err.message.includes('validation')) {
      throw error(400, 'Invalid dashboard data');
    }
    throw error(500, 'Failed to create dashboard');
  }
};