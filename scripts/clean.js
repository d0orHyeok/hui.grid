import fs from 'fs';
import { resolve } from 'path';
import { __dirname } from '../options';

const distPath = resolve(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true });
  fs.mkdirSync(distPath);
}
