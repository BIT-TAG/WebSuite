export interface AppPosition {
  x: number;
  y: number;
}

export interface AppDimensions {
  w: number;
  h: number;
}

export interface AppInfo {
  format: 'markdown' | 'html';
  content: string;
}

export interface Widget {
  id: string;
  title: string;
  kind: 'widget';
  widgetType: 'markdown' | 'html';
  content: string;
  pos: AppPosition;
  dim: AppDimensions;
  visible: boolean;
  color: string;
  props: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface App {
  id: string;
  name: string;
  kind: 'app';
  icon: string;
  url: string;
  color: string;
  status: string;
  descriptionShort: string;
  info?: AppInfo;
  pos: AppPosition;
  dim: AppDimensions;
  widgets: Widget[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface AppsData {
  version: number;
  apps: App[];
  lastModified: string;
}