import { writable, derived } from 'svelte/store';
import type { DashboardStructure, DashboardNode, ViewState, BreadcrumbItem } from '$lib/types/dashboard';

// Dashboard structure store
export const dashboardStructure = writable<DashboardStructure | null>(null);

// View state store
export const viewState = writable<ViewState>({
  currentView: 'tree',
  selectedNodeId: undefined,
  expandedNodes: new Set(['main']),
  zoom: 1,
  pan: { x: 0, y: 0 }
});

// Current selected node
export const selectedNode = derived(
  [dashboardStructure, viewState],
  ([$structure, $viewState]) => {
    if (!$structure || !$viewState.selectedNodeId) return null;
    return $structure.nodes[$viewState.selectedNodeId] || null;
  }
);

// Breadcrumb path
export const breadcrumbPath = writable<BreadcrumbItem[]>([]);

// Search query
export const searchQuery = writable('');

// Filtered nodes based on search
export const filteredNodes = derived(
  [dashboardStructure, searchQuery],
  ([$structure, $query]) => {
    if (!$structure || !$query.trim()) return $structure?.nodes || {};
    
    const query = $query.toLowerCase();
    const filtered: Record<string, DashboardNode> = {};
    
    Object.values($structure.nodes).forEach(node => {
      if (
        node.name.toLowerCase().includes(query) ||
        node.description?.toLowerCase().includes(query) ||
        node.metadata.tags.some(tag => tag.toLowerCase().includes(query))
      ) {
        filtered[node.id] = node;
      }
    });
    
    return filtered;
  }
);

// Load dashboard structure
export async function loadDashboards() {
  try {
    const response = await fetch('/api/dashboards');
    if (!response.ok) throw new Error('Failed to load dashboards');
    
    const structure = await response.json();
    dashboardStructure.set(structure);
    return structure;
  } catch (error) {
    console.error('Failed to load dashboards:', error);
    throw error;
  }
}

// Create new dashboard
export async function createDashboard(data: {
  name: string;
  type: 'personal' | 'project' | 'team';
  description?: string;
  icon: string;
  color: string;
  parentId?: string;
  tags?: string[];
}) {
  try {
    const response = await fetch('/api/dashboards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to create dashboard');
    
    const newNode = await response.json();
    
    // Reload structure
    await loadDashboards();
    
    return newNode;
  } catch (error) {
    console.error('Failed to create dashboard:', error);
    throw error;
  }
}

// Update dashboard
export async function updateDashboard(id: string, updates: Partial<DashboardNode>) {
  try {
    const response = await fetch(`/api/dashboards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) throw new Error('Failed to update dashboard');
    
    const updatedNode = await response.json();
    
    // Reload structure
    await loadDashboards();
    
    return updatedNode;
  } catch (error) {
    console.error('Failed to update dashboard:', error);
    throw error;
  }
}

// Delete dashboard
export async function deleteDashboard(id: string) {
  try {
    const response = await fetch(`/api/dashboards/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete dashboard');
    
    // Reload structure
    await loadDashboards();
    
    return true;
  } catch (error) {
    console.error('Failed to delete dashboard:', error);
    throw error;
  }
}

// Load breadcrumb path
export async function loadBreadcrumb(nodeId: string) {
  try {
    const response = await fetch(`/api/dashboards/breadcrumb/${nodeId}`);
    if (!response.ok) throw new Error('Failed to load breadcrumb');
    
    const breadcrumb = await response.json();
    breadcrumbPath.set(breadcrumb);
    return breadcrumb;
  } catch (error) {
    console.error('Failed to load breadcrumb:', error);
    throw error;
  }
}

// View state actions
export function setCurrentView(view: 'tree' | 'list') {
  viewState.update(state => ({ ...state, currentView: view }));
}

export function selectNode(nodeId: string | undefined) {
  viewState.update(state => ({ ...state, selectedNodeId: nodeId }));
  if (nodeId) {
    loadBreadcrumb(nodeId);
  }
}

export function toggleNodeExpansion(nodeId: string) {
  viewState.update(state => {
    const newExpanded = new Set(state.expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    return { ...state, expandedNodes: newExpanded };
  });
}

export function setZoom(zoom: number) {
  viewState.update(state => ({ ...state, zoom: Math.max(0.1, Math.min(3, zoom)) }));
}

export function setPan(pan: { x: number; y: number }) {
  viewState.update(state => ({ ...state, pan }));
}