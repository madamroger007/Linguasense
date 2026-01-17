import path from 'path';
import { app } from 'electron';

export function getResourcePath(...paths: string[]) {
  if (app.isPackaged) {
    return path.join(
      process.resourcesPath,
      'app.asar.unpacked',
      'resources',
      ...paths
    );
  }

  // DEV MODE
  return path.join(process.cwd(), 'resources', ...paths);
}
