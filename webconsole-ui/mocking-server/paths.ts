import { join } from 'path';

export const projectRoot = join(__dirname, '..');
export const localConfig = join(projectRoot, 'local.config.json');

export const srcFolder = join(projectRoot, 'mocking-server');
export const staticFiles = join(srcFolder, 'static');
export const generatorsFolder = join(srcFolder, 'generators');

export const generationFolder = join(projectRoot, '.tmp');

export const dbFile = join(generationFolder, 'db.json');
export const generatedFolder = join(generationFolder, 'generated');

