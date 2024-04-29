import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';

const remove = async () => {
  const sourceFileName = path.join(
    'src',
    '1_FileManager',
    'files',
    'fileToRemove.txt'
  );

  if (!fs.existsSync(sourceFileName)) {
    throw new Error('FS operation failed');
  }

  await fsPromise.unlink(sourceFileName);
};

await remove();
