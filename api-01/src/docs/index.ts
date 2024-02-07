import { readFileSync } from 'fs';
import { join } from 'path';

const mainReadme = readFileSync(
  join(__dirname, `..`, `..`, `README.md`),
  'utf8',
);


const updateSKUDrawio = readFileSync(
  join(__dirname, `update-sku.drawio.svg`),
  'utf8',
);

let mainDocs = mainReadme.replace(`erDrawio`, erDrawio);
mainDocs = mainDocs.replace(`erDrawio`, updateSKUDrawio);

export { mainDocs };
