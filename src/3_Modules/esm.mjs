import path from 'path';
import { release, version } from 'os';
import { createServer as createServerHttp } from 'http';
import { fileURLToPath } from 'url';

import './files/c.js';

// refactoring steps
// 1. Change all `require` to import ... from 
// 2. For conditional import added { with: { type: "json" } } configs for file assertion
// 3. Added __filename and __dirname definitions
// 4. Replaced module.exports to export { ... }

const random = Math.random();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let unknownObject;

if (random > 0.5) {
  // import assertion to JSON
  unknownObject = await import('./files/a.json', { with: { type: 'json' } });
} else {
  // import assertion to JSON
  unknownObject = await import('./files/b.json', { with: { type: 'json' } });
}

console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "${path.sep}"`);

console.log(`Path to current file is ${__filename}`);
console.log(`Path to current directory is ${__dirname}`);

const myServer = createServerHttp((_, res) => {
  res.end('Request accepted');
});

const PORT = 3000;

console.log(unknownObject);

myServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log('To terminate it, use Ctrl+C combination');
});

export { unknownObject, myServer };
