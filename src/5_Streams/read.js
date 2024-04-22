import fs from 'fs';
import path from 'path';

const read = async () => {
  const fileToReadPath = path.join(
    'src',
    '5_Streams',
    'files',
    'fileToRead.txt'
  );

  const readableStream = fs.createReadStream(fileToReadPath, 'utf-8')

  readableStream.pipe(process.stdout)
  readableStream.on('error', (e) => {
    console.log('readable stream error: ', e)
  })

  readableStream.close()
};

await read();
