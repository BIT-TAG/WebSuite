import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDashboardNode, updateDashboardNode, deleteDashboardNode } from '$lib/server/dashboards';
import { UpdateDashboardSchema } from '$lib/schemas/dashboard';
import { requireAdmin } from '$lib/server/auth';

export const GET: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const node = await getDashboardNode(params.id);
    
    if (!node) {
      throw error(404, 'Dashboard not found');
    }
    
    return json(node);
  } catch (err) {
    console.error('Failed to load dashboard:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    throw error(500, 'Failed to load dashboard');
  }
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const validatedData = UpdateDashboardSchema.parse(body);
    
    const updatedNode = await updateDashboardNode(params.id, validatedData);
    
    if (!updatedNode) {
      throw error(404, 'Dashboard not found');
    }
    
    return json(updatedNode);
  } catch (err) {
    console.error('Failed to update dashboard:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    if (err instanceof Error && err.message.includes('validation')) {
      throw error(400, 'Invalid dashboard data');
    }
    throw error(500, 'Failed to update dashboard');
  }
};

export const DELETE: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const deleted = await deleteDashboardNode(params.id);
    
    if (!deleted) {
      throw error(404, 'Dashboard not found or cannot be deleted');
    }
    
    return json({ success: true });
  } catch (err) {
    console.error('Failed to delete dashboard:', err);
    if (err instanceof Error && err.message.includes('404')) {
      throw err;
    }
    throw error(500, 'Failed to delete dashboard');
  }
};