import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBreadcrumbPath } from '$lib/server/dashboards';
import { requireAdmin } from '$lib/server/auth';

export const GET: RequestHandler = async ({ params, request }) => {
  try {
    await requireAdmin(request);
    const breadcrumb = await getBreadcrumbPath(params.id);
    return json(breadcrumb);
  } catch (err) {
    console.error('Failed to get breadcrumb:', err);
    throw error(500, 'Failed to get breadcrumb');
  }
};