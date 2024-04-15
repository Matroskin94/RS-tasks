import path from 'path';
import fsAsync from 'fs/promises';
import fsSync from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_CONTENT = 'I am fresh and young';

const create = async () => {
  const resultFileName = path.join(
    'src',
    '1_FileManager',
    'files',
    'fresh.txt'
  );

  if (fsSync.existsSync(resultFileName)) {
    console.log('FS operation failed');

    return;
  }

  await fsAsync.appendFile(resultFileName, FILE_CONTENT);
};

await create();
