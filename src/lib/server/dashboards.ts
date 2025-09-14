import fs from 'fs/promises';
import path from 'path';
import type { DashboardStructure, DashboardNode } from '$lib/types/dashboard';
import { DashboardStructureSchema } from '$lib/schemas/dashboard';

const DATA_DIR = 'data';
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DASHBOARDS_FILE = path.join(DATA_DIR, 'dashboards.json');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create directories:', error);
  }
}

// Create backup before writing
async function createBackup() {
  try {
    const exists = await fs.access(DASHBOARDS_FILE).then(() => true).catch(() => false);
    if (exists) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(BACKUP_DIR, `dashboards-${timestamp}.json`);
      await fs.copyFile(DASHBOARDS_FILE, backupFile);
      
      // Keep only last 10 backups
      const backups = await fs.readdir(BACKUP_DIR);
      const sortedBackups = backups
        .filter(f => f.startsWith('dashboards-') && f.endsWith('.json'))
        .sort()
        .reverse();
      
      for (const backup of sortedBackups.slice(10)) {
        await fs.unlink(path.join(BACKUP_DIR, backup));
      }
    }
  } catch (error) {
    console.error('Failed to create backup:', error);
  }
}

// Atomic write with tmp + rename
async function atomicWrite(data: DashboardStructure) {
  await ensureDirectories();
  await createBackup();
  
  const tmpFile = `${DASHBOARDS_FILE}.tmp`;
  const content = JSON.stringify(data, null, 2);
  
  try {
    await fs.writeFile(tmpFile, content, 'utf8');
    await fs.rename(tmpFile, DASHBOARDS_FILE);
  } catch (error) {
    // Cleanup tmp file on error
    try {
      await fs.unlink(tmpFile);
    } catch {}
    throw error;
  }
}

// Load dashboard structure
export async function loadDashboardStructure(): Promise<DashboardStructure> {
  try {
    await ensureDirectories();
    const content = await fs.readFile(DASHBOARDS_FILE, 'utf8');
    const data = JSON.parse(content);
    return DashboardStructureSchema.parse(data);
  } catch (error) {
    // Return default structure if file doesn't exist or is invalid
    const defaultStructure: DashboardStructure = {
      version: 1,
      nodes: {
        'main': {
          id: 'main',
          name: 'WebSuite IO',
          type: 'main',
          description: 'Hauptdashboard für alle Bereiche',
          icon: '🏠',
          color: '#3b82f6',
          children: ['personal', 'projects', 'teams'],
          position: { x: 0, y: 0 },
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            tags: [],
            isTemplate: false
          },
          config: {
            widgets: [],
            layout: 'grid',
            permissions: {
              view: ['*'],
              edit: ['admin'],
              admin: ['admin']
            }
          }
        },
        'personal': {
          id: 'personal',
          name: 'Persönliches Dashboard',
          type: 'personal',
          description: 'Ihr persönlicher Arbeitsbereich',
          icon: '👤',
          color: '#10b981',
          parentId: 'main',
          children: [],
          position: { x: -200, y: 150 },
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            tags: ['personal'],
            isTemplate: false
          },
          config: {
            widgets: [],
            layout: 'grid',
            permissions: {
              view: ['user'],
              edit: ['user'],
              admin: ['user']
            }
          }
        },
        'projects': {
          id: 'projects',
          name: 'Projekte',
          type: 'project',
          description: 'Alle Projekt-Dashboards',
          icon: '📁',
          color: '#8b5cf6',
          parentId: 'main',
          children: [],
          position: { x: 0, y: 150 },
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            tags: ['projects'],
            isTemplate: false
          },
          config: {
            widgets: [],
            layout: 'grid',
            permissions: {
              view: ['*'],
              edit: ['project-manager'],
              admin: ['admin']
            }
          }
        },
        'teams': {
          id: 'teams',
          name: 'Teams',
          type: 'team',
          description: 'Alle Team-Dashboards',
          icon: '👥',
          color: '#f59e0b',
          parentId: 'main',
          children: [],
          position: { x: 200, y: 150 },
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            tags: ['teams'],
            isTemplate: false
          },
          config: {
            widgets: [],
            layout: 'grid',
            permissions: {
              view: ['*'],
              edit: ['team-lead'],
              admin: ['admin']
            }
          }
        }
      },
      rootId: 'main',
      lastModified: new Date().toISOString()
    };
    await atomicWrite(defaultStructure);
    return defaultStructure;
  }
}

// Save dashboard structure
export async function saveDashboardStructure(structure: DashboardStructure): Promise<void> {
  const validatedStructure = DashboardStructureSchema.parse({
    ...structure,
    lastModified: new Date().toISOString()
  });
  await atomicWrite(validatedStructure);
}

// Get node by ID
export async function getDashboardNode(id: string): Promise<DashboardNode | null> {
  const structure = await loadDashboardStructure();
  return structure.nodes[id] || null;
}

// Add new dashboard node
export async function addDashboardNode(node: Omit<DashboardNode, 'id' | 'metadata'>): Promise<DashboardNode> {
  const structure = await loadDashboardStructure();
  
  const newNode: DashboardNode = {
    ...node,
    id: crypto.randomUUID(),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user', // TODO: Get from session
      tags: node.metadata?.tags || [],
      isTemplate: false
    }
  };
  
  structure.nodes[newNode.id] = newNode;
  
  // Add to parent's children if parentId exists
  if (newNode.parentId && structure.nodes[newNode.parentId]) {
    structure.nodes[newNode.parentId].children.push(newNode.id);
  }
  
  structure.version += 1;
  await saveDashboardStructure(structure);
  return newNode;
}

// Update dashboard node
export async function updateDashboardNode(id: string, updates: Partial<DashboardNode>): Promise<DashboardNode | null> {
  const structure = await loadDashboardStructure();
  
  if (!structure.nodes[id]) {
    return null;
  }
  
  const updatedNode: DashboardNode = {
    ...structure.nodes[id],
    ...updates,
    id, // Ensure ID doesn't change
    metadata: {
      ...structure.nodes[id].metadata,
      ...updates.metadata,
      updatedAt: new Date().toISOString()
    }
  };
  
  structure.nodes[id] = updatedNode;
  structure.version += 1;
  await saveDashboardStructure(structure);
  return updatedNode;
}

// Delete dashboard node
export async function deleteDashboardNode(id: string): Promise<boolean> {
  const structure = await loadDashboardStructure();
  
  if (!structure.nodes[id] || id === structure.rootId) {
    return false; // Can't delete root or non-existent node
  }
  
  const node = structure.nodes[id];
  
  // Remove from parent's children
  if (node.parentId && structure.nodes[node.parentId]) {
    structure.nodes[node.parentId].children = structure.nodes[node.parentId].children.filter(
      childId => childId !== id
    );
  }
  
  // Recursively delete children
  for (const childId of node.children) {
    await deleteDashboardNode(childId);
  }
  
  delete structure.nodes[id];
  structure.version += 1;
  await saveDashboardStructure(structure);
  return true;
}

// Get breadcrumb path
export async function getBreadcrumbPath(nodeId: string): Promise<Array<{ id: string; name: string; type: DashboardNode['type'] }>> {
  const structure = await loadDashboardStructure();
  const path: Array<{ id: string; name: string; type: DashboardNode['type'] }> = [];
  
  let currentId: string | undefined = nodeId;
  while (currentId && structure.nodes[currentId]) {
    const node = structure.nodes[currentId];
    path.unshift({
      id: node.id,
      name: node.name,
      type: node.type
    });
    currentId = node.parentId;
  }
  
  return path;
}