import path from 'path';

import { getHash } from './utils/getHash.js';
import { readFile } from './utils/readFile.js';

const calculateHash = async () => {
  const fileToReadPath = path.join(
    'src',
    '4_Hash',
    'files',
    'fileToCalculateHashFor.txt'
  );

  const fileContent = await readFile(fileToReadPath);
  const fileHash = getHash(fileContent);

  console.log('fileHash', fileHash);
};

await calculateHash();
