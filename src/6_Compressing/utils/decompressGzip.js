import fs from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream'
import { createGunzip } from 'zlib';

export const decompressGzip = async (inputFilePath, outputFilePath) => {
  const pipe = promisify(pipeline);

  const inputFileReadStream = fs.createReadStream(inputFilePath);
  const outputFileWriteStream = fs.createWriteStream(outputFilePath);
  const gunzipStream = createGunzip()

  await pipe(inputFileReadStream, gunzipStream, outputFileWriteStream);
};
