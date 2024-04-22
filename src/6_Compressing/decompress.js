import path from 'path'

import { decompressGzip } from './utils/decompressGzip.js';

const decompress = async () => {
  const filesBasePath = path.join('src', '6_Compressing', 'files');
  const archivePath = path.join(filesBasePath, 'archive.gz');
  const decompressedFilePath = path.join(filesBasePath, 'decompressed.txt');

  await decompressGzip(archivePath, decompressedFilePath);
};

await decompress();
