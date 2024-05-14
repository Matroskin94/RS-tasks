import { IncomingMessage, ServerResponse } from 'http';

import { IServiceRequest, IServiceResponse } from '../types';

export const modifyPOSTRequestBody = (
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
): Promise<{ request: IServiceRequest; response: IServiceResponse }> => {
  let body = [];
  let parsedBody;

  return new Promise((resolve) => {
    request
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        parsedBody = Buffer.concat(body).toString();

        (request as IServiceRequest).body = parsedBody;

        resolve({ request, response });
      });
  });
};
