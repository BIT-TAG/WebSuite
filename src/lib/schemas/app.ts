import { z } from 'zod';

export const AppPositionSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0)
});

export const AppDimensionsSchema = z.object({
  w: z.number().min(1).max(6),
  h: z.number().min(1).max(6)
});

export const AppInfoSchema = z.object({
  format: z.enum(['markdown', 'html']),
  content: z.string()
});

export const WidgetSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  kind: z.literal('widget'),
  widgetType: z.enum(['markdown', 'html']),
  content: z.string(),
  pos: AppPositionSchema,
  dim: AppDimensionsSchema,
  visible: z.boolean(),
  color: z.string(),
  props: z.record(z.any()),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const AppSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  kind: z.literal('app'),
  icon: z.string(),
  url: z.string().url(),
  color: z.string(),
  status: z.string(),
  descriptionShort: z.string(),
  info: AppInfoSchema.optional(),
  pos: AppPositionSchema,
  dim: AppDimensionsSchema,
  widgets: z.array(WidgetSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number().min(1)
});

export const AppsDataSchema = z.object({
  version: z.number().min(1),
  apps: z.array(AppSchema),
  lastModified: z.string()
});

export const CreateAppSchema = z.object({
  name: z.string().min(1),
  icon: z.string(),
  url: z.string().url(),
  color: z.string(),
  descriptionShort: z.string(),
  info: AppInfoSchema.optional(),
  pos: AppPositionSchema.optional(),
  dim: AppDimensionsSchema.optional()
});

export const UpdateAppSchema = CreateAppSchema.partial();

export const CreateWidgetSchema = z.object({
  title: z.string().min(1),
  widgetType: z.enum(['markdown', 'html']),
  content: z.string(),
  pos: AppPositionSchema.optional(),
  dim: AppDimensionsSchema.optional(),
  visible: z.boolean().optional(),
  color: z.string().optional(),
  props: z.record(z.any()).optional()
});

export const UpdateWidgetSchema = CreateWidgetSchema.partial();