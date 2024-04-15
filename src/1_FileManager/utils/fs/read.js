import fsPromise from 'fs/promises';
import path from 'path';
import fs from 'fs';

const read = async () => {
  const fileToReadPath = path.join(
    'src',
    '1_FileManager',
    'files',
    'fileToRead.txt'
  );

  if (!fs.existsSync(fileToReadPath)) {
    throw new Error('FS operation failed');
  }

  const fileContents = await fsPromise.readFile(fileToReadPath, { encoding: 'utf8' });

  console.log('fileContents', fileContents);
};

await read();
