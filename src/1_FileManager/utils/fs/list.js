import fsPromise from 'fs/promises';
import fs from 'fs';
import path from 'path';

const list = async () => {
  const sourceDirName = path.join('src', '1_FileManager', 'files');

  if (!fs.existsSync(sourceDirName)) {
    console.log('FS operation failed');

    return;
  }

  const dirFiles = await fsPromise.readdir(sourceDirName);
  dirFiles.map((file) => {
    console.log(file);
  });
};

await list();
