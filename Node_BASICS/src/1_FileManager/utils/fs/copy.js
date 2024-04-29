import path from 'path';
import fsPromises from 'fs/promises';

const copy = async () => {
  const sourceFolderName = path.join('src', '1_FileManager', 'files');
  const resultFolderName = path.join('src', '1_FileManager', 'files_copy');

  await fsPromises
    .cp(sourceFolderName, resultFolderName, {
      recursive: true,
      errorOnExist: true,
      force: false,
    })
    .catch(() => console.log('FS operation failed'));
};

await copy();
