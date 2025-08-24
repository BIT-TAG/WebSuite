import { z } from 'zod';

export const WidgetSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'counter', 'todo', 'weather', 'chart']),
  config: z.record(z.any()),
});

export const AppSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name ist erforderlich'),
  icon: z.string().min(1, 'Icon ist erforderlich'),
  widgets: z.array(WidgetSchema).default([]),
});

export const AppsDataSchema = z.object({
  apps: z.array(AppSchema),
});

export type Widget = z.infer<typeof WidgetSchema>;
export type App = z.infer<typeof AppSchema>;
export type AppsData = z.infer<typeof AppsDataSchema>;

export const CreateAppSchema = AppSchema.omit({ id: true });
export const UpdateAppSchema = AppSchema.partial().required({ id: true });

export type CreateApp = z.infer<typeof CreateAppSchema>;
export type UpdateApp = z.infer<typeof UpdateAppSchema>;