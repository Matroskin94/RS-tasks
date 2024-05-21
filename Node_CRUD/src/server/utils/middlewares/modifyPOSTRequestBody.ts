import { IServiceRequest, IServiceResponse } from '../NetworkService/types';
import { TNext } from '../MiddlewarePipeline/types';

export const modifyPOSTRequestBody = (
  request: IServiceRequest,
  response: IServiceResponse,
  next: TNext<IServiceRequest, IServiceResponse>
) => {
  let body: any[] = [];
  let parsedBody;

  return new Promise<void>((resolve) => {
    request
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        parsedBody = Buffer.concat(body).toString();

        (request as IServiceRequest).body = parsedBody;

        resolve();
      });
  }).then(() => {
    next();
  });
};
