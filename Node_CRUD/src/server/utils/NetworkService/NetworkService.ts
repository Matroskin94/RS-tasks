import https from 'https';
import fs from 'fs';
import path from 'path';

import {
  IServiceResponse,
  IServiceRequest,
  TRequestHandler,
  TRequestsMap,
} from './types';
import { DEFAULT_REQUEST_HANDLERS, HTTP_METHOD } from './constants';
import { convertToUrlKey } from './helpers/convertToUrlKey';
import { getFullRequestUrl } from './helpers/getFullRequestURL';
import { modifyPOSTRequestBody } from './helpers/modifyPOSTRequestBody';

// TODO: Add middleware functionality
// Middlewares are good for request validation and error handling
// In this task it usefull for request validation
// Link for req.body validation: https://medium.com/@techsuneel99/validate-incoming-requests-in-node-js-like-a-pro-95fbdff4bc07
// Link for Middleware/Mediator pattern: https://www.patterns.dev/vanilla/mediator-pattern/
// Link for Mediator implementation: https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/

export class NetworkService {
  apiBase: string;
  protected requestHandlers: TRequestsMap;
  protected request: IServiceRequest;
  protected response: IServiceResponse;

  constructor({ apiBase, port }) {
    this.requestHandlers = DEFAULT_REQUEST_HANDLERS;
    this.apiBase = apiBase;

    const basePath = path.join(
      'src',
      'server',
      'utils',
      'NetworkService',
      'cert'
    );

    https
      .createServer(
        {
          cert: fs.readFileSync(`${basePath}/localhost.crt`),
          key: fs.readFileSync(`${basePath}/localhost.key`),
        },
        (request, response) => {
          const reqMethod = request.method as HTTP_METHOD;
          const reqUrl = request.url;
          const requestHandler = this.getRequestHandler(reqMethod, reqUrl);

          if (requestHandler) {
            if (reqMethod === HTTP_METHOD.POST) {
              modifyPOSTRequestBody(request, response).then(
                ({ request: mRequest, response: mResponse }) => {
                  requestHandler(mRequest, mResponse);
                }
              );
            } else {
              requestHandler(request, response);
            }
          } else {
            response.statusCode = 404;
            response.end('Request not found');
          }
        }
      )
      .listen(port, undefined, () => {
        console.log(`Server listening on https://localhost:${port}/`);
      });
  }

  get(url: string, callback: TRequestHandler): void {
    const fullUrl = getFullRequestUrl(this.apiBase, url);

    if (!this.getRequestHandler(HTTP_METHOD.GET, fullUrl)) {
      this.setRequestHandler(HTTP_METHOD.GET, fullUrl, callback);
    }
  }

  post(url: string, callback: TRequestHandler): void {
    const fullUrl = getFullRequestUrl(this.apiBase, url);

    if (!this.getRequestHandler(HTTP_METHOD.POST, fullUrl)) {
      this.setRequestHandler(HTTP_METHOD.POST, fullUrl, callback);
    }
  }

  put(url: string, callback: TRequestHandler): void {
    const fullUrl = getFullRequestUrl(this.apiBase, url);

    if (!this.getRequestHandler(HTTP_METHOD.PUT, fullUrl)) {
      this.setRequestHandler(HTTP_METHOD.PUT, fullUrl, callback);
    }
  }

  delete(url: string, callback: TRequestHandler): void {
    const fullUrl = getFullRequestUrl(this.apiBase, url);

    if (!this.getRequestHandler(HTTP_METHOD.DELETE, fullUrl)) {
      this.setRequestHandler(HTTP_METHOD.DELETE, fullUrl, callback);
    }
  }

  protected setRequestHandler(
    method: HTTP_METHOD,
    url: string,
    callback: TRequestHandler
  ) {
    const handlerKey = convertToUrlKey(url);

    this.requestHandlers[method][handlerKey] = callback;
  }

  protected getRequestHandler(method: HTTP_METHOD, url: string) {
    const handlerKey = convertToUrlKey(url);

    if (
      this.requestHandlers[method] &&
      this.requestHandlers[method][handlerKey]
    ) {
      return this.requestHandlers[method][handlerKey];
    }
  }
}
