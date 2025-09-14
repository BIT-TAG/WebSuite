export interface DashboardNode {
  id: string;
  name: string;
  type: 'main' | 'personal' | 'project' | 'team';
  description?: string;
  icon: string;
  color: string;
  parentId?: string;
  children: string[];
  position: { x: number; y: number };
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags: string[];
    isTemplate: boolean;
  };
  config: {
    widgets: string[];
    layout: 'grid' | 'kanban' | 'list';
    permissions: {
      view: string[];
      edit: string[];
      admin: string[];
    };
  };
}

export interface DashboardStructure {
  version: number;
  nodes: Record<string, DashboardNode>;
  rootId: string;
  lastModified: string;
}

export interface ViewState {
  currentView: 'tree' | 'list';
  selectedNodeId?: string;
  expandedNodes: Set<string>;
  zoom: number;
  pan: { x: number; y: number };
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  type: DashboardNode['type'];
}