import { readFileSync } from 'fs';
import { join } from 'path';

const authReadme = readFileSync(join(__dirname, `auth.md`), 'utf8');

let authDocs = authReadme;

export { authDocs };
