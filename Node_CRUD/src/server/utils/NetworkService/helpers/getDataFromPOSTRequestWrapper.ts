import { IncomingMessage, ServerResponse } from 'http';

import { IServiceRequest, TRequestHandler } from '../types';

export const getDataFromPOSTRequestWrapper = (
  requestHandler: TRequestHandler
) => {
  return (
    request: IncomingMessage,
    response: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ) => {
    let body = [];
    let parsedBody;

    request
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        parsedBody = Buffer.concat(body).toString();

        (request as IServiceRequest).body = parsedBody;
        requestHandler(request, response);
      });
  };
};
