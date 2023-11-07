import fs from 'fs';
import { resolve } from 'path';
import { __dirname } from '../options';

const distPath = resolve(__dirname, '..', 'dist/es/types');
if (fs.existsSync(distPath)) fs.rmSync(distPath, { recursive: true });
