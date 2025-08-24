import fs from 'fs/promises';
import path from 'path';
import { AppsData, AppsDataSchema } from './schemas';

const DATA_FILE = path.join(process.cwd(), 'data', 'apps.json');

export async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function readAppsData(): Promise<AppsData> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return AppsDataSchema.parse(parsed);
  } catch (error) {
    // Datei existiert nicht oder ist ungültig - erstelle Default-Daten
    const defaultData: AppsData = { apps: [] };
    await writeAppsData(defaultData);
    return defaultData;
  }
}

export async function writeAppsData(data: AppsData): Promise<void> {
  await ensureDataDirectory();
  
  // Validiere Daten vor dem Schreiben
  const validatedData = AppsDataSchema.parse(data);
  
  // Atomares Schreiben: erst in temporäre Datei, dann umbenennen
  const tempFile = DATA_FILE + '.tmp';
  await fs.writeFile(tempFile, JSON.stringify(validatedData, null, 2), 'utf-8');
  await fs.rename(tempFile, DATA_FILE);
}

export async function findAppById(id: string): Promise<AppsData['apps'][0] | null> {
  const data = await readAppsData();
  return data.apps.find(app => app.id === id) || null;
}