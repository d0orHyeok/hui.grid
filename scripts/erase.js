import fs from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const distPath = resolve(__dirname, '..', 'dist/es/types');
if (fs.existsSync(distPath)) fs.rmSync(distPath, { recursive: true });