import https from 'https';
import fs from 'fs';
import path from 'path';

import {
  IServiceResponse,
  IServiceRequest,
  IServiceMessageResult,
  TRequestHandler,
  TRequestsMap,
} from './types';
import { DEFAULT_REQUEST_HANDLERS, HTTP_METHOD } from './constants';
import { convertToUrlKey } from './helpers/convertToUrlKey';
import { getFullRequestUrl } from './helpers/getFulLRequestURL';

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
            requestHandler(request, response);
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
