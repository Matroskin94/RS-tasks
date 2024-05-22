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
import { modifyPOSTRequestBody } from '../middlewares/modifyPOSTRequestBody';
import { TMiddleware } from '../MiddlewarePipeline/types';
import { MiddlewarePipeline } from '../MiddlewarePipeline/MiddlewarePipeline';

interface INetworkServiceParams {
  apiBase: string;
  port: number;
}

export class NetworkService {
  readonly apiBase: string;
  protected requestHandlers: TRequestsMap;

  constructor({ apiBase, port }: INetworkServiceParams) {
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
          const reqUrl = request.url || '';
          const requestHandler = this.getRequestHandler(reqMethod, reqUrl);

          if (requestHandler) {
            const middleware = this.getRequestMiddleware(reqMethod, reqUrl);
            console.log("middleware", middleware);
            middleware
              ?.execute(request, response)
              .then(([updatedRequest, updatedResponse]) => {
                requestHandler(updatedRequest, updatedResponse);
              });
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

  get(
    url: string,
    callback: TRequestHandler,
    middlewares: TMiddleware<IServiceRequest, IServiceResponse>[] = []
  ): void {
    const fullUrl = getFullRequestUrl(this.apiBase, url);

    if (!this.getRequestHandler(HTTP_METHOD.GET, fullUrl)) {
      this.setRequestHandler(HTTP_METHOD.GET, fullUrl, callback);
      this.setRequestMiddleware(HTTP_METHOD.GET, fullUrl, middlewares);
    }
  }

  post(
    url: string,
    callback: TRequestHandler,
    middlewares: TMiddleware<IServiceRequest, IServiceResponse>[] = []
  ): void {
    const fullUrl = getFullRequestUrl(this.apiBase, url);

    if (!this.getRequestHandler(HTTP_METHOD.POST, fullUrl)) {
      const postDefaultMiddlewares = [modifyPOSTRequestBody];

      this.setRequestHandler(HTTP_METHOD.POST, fullUrl, callback);
      this.setRequestMiddleware(HTTP_METHOD.POST, fullUrl, [
        ...postDefaultMiddlewares,
        ...middlewares,
      ]);
    }
  }

  put(
    url: string,
    callback: TRequestHandler,
    middlewares: TMiddleware<IServiceRequest, IServiceResponse>[] = []
  ): void {
    const fullUrl = getFullRequestUrl(this.apiBase, url);

    if (!this.getRequestHandler(HTTP_METHOD.PUT, fullUrl)) {
      this.setRequestHandler(HTTP_METHOD.PUT, fullUrl, callback);
      this.setRequestMiddleware(HTTP_METHOD.PUT, fullUrl, middlewares);
    }
  }

  delete(
    url: string,
    callback: TRequestHandler,
    middlewares: TMiddleware<IServiceRequest, IServiceResponse>[] = []
  ): void {
    const fullUrl = getFullRequestUrl(this.apiBase, url);

    if (!this.getRequestHandler(HTTP_METHOD.DELETE, fullUrl)) {
      this.setRequestHandler(HTTP_METHOD.DELETE, fullUrl, callback);
      this.setRequestMiddleware(HTTP_METHOD.PUT, fullUrl, middlewares);
    }
  }

  protected setRequestHandler(
    method: HTTP_METHOD,
    url: string,
    callback: TRequestHandler
  ) {
    const handlerKey = convertToUrlKey(url);

    this.requestHandlers[method][handlerKey] = {
      handler: callback,
      middlewares: null,
    };
  }

  protected setRequestMiddleware(
    method: HTTP_METHOD,
    url: string,
    middlewares: TMiddleware<IServiceRequest, IServiceResponse>[]
  ) {
    const handlerKey = convertToUrlKey(url);

    if (
      this.requestHandlers[method] &&
      this.requestHandlers[method][handlerKey]
    ) {
      this.requestHandlers[method][handlerKey].middlewares =
        new MiddlewarePipeline(middlewares);
    } else {
      throw Error('Set request handler before setting middleware');
    }
  }

  protected getRequestHandler(method: HTTP_METHOD, url: string) {
    const handlerKey = convertToUrlKey(url);

    if (
      this.requestHandlers[method] &&
      this.requestHandlers[method][handlerKey]
    ) {
      return this.requestHandlers[method][handlerKey].handler;
    }
  }

  protected getRequestMiddleware(method: HTTP_METHOD, url: string) {
    const handlerKey = convertToUrlKey(url);

    if (
      this.requestHandlers[method] &&
      this.requestHandlers[method][handlerKey]
    ) {
      return this.requestHandlers[method][handlerKey].middlewares;
    }
  }
}
