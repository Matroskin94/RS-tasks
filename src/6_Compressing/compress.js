import path from 'path';

import { compressGzip } from './utils/compressGzip.js';

const compress = async () => {
  const filesBasePath = path.join('src', '6_compressing', 'files');
  const fileToCompressPath = path.join(filesBasePath, 'fileToCompress.txt');
  const archivePath = path.join(filesBasePath, 'archive.gz');
  await compressGzip(fileToCompressPath, archivePath).catch((e) => {
    console.log('Compressing error', e);
  });
};

await compress();
