import fs from 'fs';
import path from 'path';

const write = async () => {
  const fileToWriteName = path.join(
    'src',
    '5_Streams',
    'files',
    'fileToWrite.txt'
  );
  const writableStream = fs.createWriteStream(fileToWriteName)

  console.log('Application is running, you can type something...')

  process.stdin.on('data', (data) => {
    writableStream.write(data.toString('utf-8'))
  });
};

await write();
