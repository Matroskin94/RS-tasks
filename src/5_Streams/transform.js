import { Transform } from 'stream';

const transform = async () => {
  const reverseStream = new Transform({
    transform(data, encoding, callback) {
      const reversedData = data.toString().split('').reverse().join('');
      this.push(reversedData);
      callback();
    },
  });
  
  process.stdin.pipe(reverseStream).pipe(process.stdout)
};

await transform();
