import fs from 'fs';
import { resolve } from 'path';
import { __dirname } from '../options';

const root = resolve(__dirname, '..');

function main() {
  const stringPkg = fs.readFileSync(root + '\\package.json').toString('utf-8');
  const pkg = JSON.parse(stringPkg);
  const deleteKeys = ['lint-staged', 'dependencies', 'devDependencies', 'scripts'];
  deleteKeys.forEach((key) => delete pkg[key]);
  pkg.private = false;
  if (pkg.main.startsWith('\\dist\\')) {
    pkg.main = pkg.main.slice(5);
  }
  fs.writeFileSync(root + '\\dist\\package.json', Buffer.from(JSON.stringify(pkg, null, 2), 'utf-8'));
  fs.writeFileSync(root + '\\dist\\version.txt', Buffer.from(pkg.version, 'utf-8'));
}

main();
