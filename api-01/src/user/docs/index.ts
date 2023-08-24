import { readFileSync } from 'fs';
import { join } from 'path';

const userReadme = readFileSync(join(__dirname, `user.md`), 'utf8');

let userDocs = userReadme;

export { userDocs };
