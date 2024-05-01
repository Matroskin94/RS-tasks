import https from 'https';
import fs from 'fs';
import path from 'path';
import { SERVER_CONFIG } from './configs';

export const serverStart = () => {
  const basePath = path.join('src', 'server');
  return https
    .createServer(
      {
        cert: fs.readFileSync(`${basePath}/localhost.crt`),
        key: fs.readFileSync(`${basePath}/localhost.key`),
      },
      (req, res) => {
        console.log('Request', req);

        res.statusCode = 200;
        res.write('Hello from server');
        res.end();
      }
    )
    .listen(SERVER_CONFIG.PORT, undefined, () => {
      console.log(
        `Server listening on https://localhost:${SERVER_CONFIG.PORT}/`
      );
    });
};
