import { z } from 'zod';

export const DashboardNodeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(['main', 'personal', 'project', 'team']),
  description: z.string().optional(),
  icon: z.string(),
  color: z.string(),
  parentId: z.string().optional(),
  children: z.array(z.string()),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
    tags: z.array(z.string()),
    isTemplate: z.boolean()
  }),
  config: z.object({
    widgets: z.array(z.string()),
    layout: z.enum(['grid', 'kanban', 'list']),
    permissions: z.object({
      view: z.array(z.string()),
      edit: z.array(z.string()),
      admin: z.array(z.string())
    })
  })
});

export const DashboardStructureSchema = z.object({
  version: z.number().min(1),
  nodes: z.record(DashboardNodeSchema),
  rootId: z.string(),
  lastModified: z.string()
});

export const CreateDashboardSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['personal', 'project', 'team']),
  description: z.string().optional(),
  icon: z.string(),
  color: z.string(),
  parentId: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const UpdateDashboardSchema = CreateDashboardSchema.partial();