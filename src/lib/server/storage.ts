import fs from 'fs/promises';
import path from 'path';
import { AppsDataSchema, type AppsData, type App } from '$lib/schemas/app';

const DATA_DIR = 'data';
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const APPS_FILE = path.join(DATA_DIR, 'apps.json');

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
    const exists = await fs.access(APPS_FILE).then(() => true).catch(() => false);
    if (exists) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(BACKUP_DIR, `apps-${timestamp}.json`);
      await fs.copyFile(APPS_FILE, backupFile);
      
      // Keep only last 10 backups
      const backups = await fs.readdir(BACKUP_DIR);
      const sortedBackups = backups
        .filter(f => f.startsWith('apps-') && f.endsWith('.json'))
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
async function atomicWrite(data: AppsData) {
  await ensureDirectories();
  await createBackup();
  
  const tmpFile = `${APPS_FILE}.tmp`;
  const content = JSON.stringify(data, null, 2);
  
  try {
    await fs.writeFile(tmpFile, content, 'utf8');
    await fs.rename(tmpFile, APPS_FILE);
  } catch (error) {
    // Cleanup tmp file on error
    try {
      await fs.unlink(tmpFile);
    } catch {}
    throw error;
  }
}

// Load apps data
export async function loadAppsData(): Promise<AppsData> {
  try {
    await ensureDirectories();
    const content = await fs.readFile(APPS_FILE, 'utf8');
    const data = JSON.parse(content);
    return AppsDataSchema.parse(data);
  } catch (error) {
    // Return default data if file doesn't exist or is invalid
    const defaultData: AppsData = {
      version: 1,
      apps: [],
      lastModified: new Date().toISOString()
    };
    await atomicWrite(defaultData);
    return defaultData;
  }
}

// Save apps data
export async function saveAppsData(data: AppsData): Promise<void> {
  const validatedData = AppsDataSchema.parse({
    ...data,
    lastModified: new Date().toISOString()
  });
  await atomicWrite(validatedData);
}

// Get all apps
export async function getAllApps(): Promise<App[]> {
  const data = await loadAppsData();
  return data.apps;
}

// Get app by ID
export async function getAppById(id: string): Promise<App | null> {
  const data = await loadAppsData();
  return data.apps.find(app => app.id === id) || null;
}

// Add new app
export async function addApp(app: Omit<App, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<App> {
  const data = await loadAppsData();
  
  const newApp: App = {
    ...app,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  };
  
  data.apps.push(newApp);
  data.version += 1;
  
  await saveAppsData(data);
  return newApp;
}

// Update app
export async function updateApp(id: string, updates: Partial<App>): Promise<App | null> {
  const data = await loadAppsData();
  const appIndex = data.apps.findIndex(app => app.id === id);
  
  if (appIndex === -1) {
    return null;
  }
  
  const updatedApp: App = {
    ...data.apps[appIndex],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
    version: data.apps[appIndex].version + 1
  };
  
  data.apps[appIndex] = updatedApp;
  data.version += 1;
  
  await saveAppsData(data);
  return updatedApp;
}

// Delete app
export async function deleteApp(id: string): Promise<boolean> {
  const data = await loadAppsData();
  const initialLength = data.apps.length;
  
  data.apps = data.apps.filter(app => app.id !== id);
  
  if (data.apps.length === initialLength) {
    return false; // App not found
  }
  
  data.version += 1;
  await saveAppsData(data);
  return true;
}