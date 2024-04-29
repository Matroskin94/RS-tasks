import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';

const rename = async () => {
  const sourceFileName = path.join(
    'src',
    '1_FileManager',
    'files',
    'wrongFileName.txt'
  );
  const resultFileName = path.join(
    'src',
    '1_FileManager',
    'files',
    'properFileName.md'
  );

  if (!fs.existsSync(sourceFileName) || fs.existsSync(resultFileName)) {
    throw new Error('FS operation failed');
  }

  await fsPromise.rename(sourceFileName, resultFileName);
};

await rename();
