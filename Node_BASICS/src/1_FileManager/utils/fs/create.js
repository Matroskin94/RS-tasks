import path from 'path';
import fsAsync from 'fs/promises';
import fsSync from 'fs';
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
