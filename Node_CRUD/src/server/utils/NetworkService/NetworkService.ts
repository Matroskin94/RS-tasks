import https from 'https';
import fs from 'fs';
import path from 'path';

import {
  IServiceResponse,
  IServiceRequest,
  TRequestHandler,
  TRequestsMap,
  IRequestConfig,
} from './types';
import {
  DEFAULT_REQUEST_ARRAY_HANDLERS,
  DEFAULT_REQUEST_HANDLERS,
  HTTP_METHOD,
  PARAM_DELIMITER,
} from './constants';
import { convertToUrlKey } from './helpers/convertToUrlKey';
import { getFullRequestUrl } from './helpers/getFullRequestURL';
import { modifyPOSTRequestBody } from '../middlewares/modifyPOSTRequestBody';
import { TMiddleware } from '../MiddlewarePipeline/types';
import { MiddlewarePipeline } from '../MiddlewarePipeline/MiddlewarePipeline';
import { addRequestIdParamToBodyParams } from '../middlewares/addRequestIdParamToBodyParams';

interface INetworkServiceParams {
  apiBase: string;
  port: number;
  paramDelimiter?: string;
}

export class NetworkService {
  readonly apiBase: string;
  readonly paramDelimiter;
  protected requestHandlers: TRequestsMap<Record<string, IRequestConfig>>;
  protected requestHandlersUpdated: TRequestsMap<IRequestConfig[]>;

  constructor({ apiBase, port, paramDelimiter }: INetworkServiceParams) {
    this.requestHandlers = DEFAULT_REQUEST_HANDLERS;
    // TODO: Rename to requestHandlers after refactoring to updated headers.
    this.requestHandlersUpdated = DEFAULT_REQUEST_ARRAY_HANDLERS;
    this.apiBase = apiBase;
    this.paramDelimiter = paramDelimiter || PARAM_DELIMITER;

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
    if (!this.getRequest(HTTP_METHOD.GET, url)) {
      this.setRequest(HTTP_METHOD.GET, url, callback, middlewares);
    }
  }

  post(
    url: string,
    callback: TRequestHandler,
    middlewares: TMiddleware<IServiceRequest, IServiceResponse>[] = []
  ): void {
    if (!this.getRequest(HTTP_METHOD.GET, url)) {
      const postDefaultMiddlewares = [modifyPOSTRequestBody];

      this.setRequest(HTTP_METHOD.POST, url, callback, [
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

    // TODO: Update to this.getRequest, this.setRequest methods
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

    // TODO: Update to this.getRequest, this.setRequest methods
    if (!this.getRequestHandler(HTTP_METHOD.DELETE, fullUrl)) {
      this.setRequestHandler(HTTP_METHOD.DELETE, fullUrl, callback);
      this.setRequestMiddleware(HTTP_METHOD.PUT, fullUrl, middlewares);
    }
  }

  protected setRequest(
    method: HTTP_METHOD,
    url: string,
    callback: TRequestHandler,
    middlewares: TMiddleware<IServiceRequest, IServiceResponse>[] = []
  ) {
    if (!this.getRequest(method, url)) {
      const urlWithApiBase = getFullRequestUrl(this.apiBase, url);
      const pathTemplate = urlWithApiBase.split('/').filter(Boolean);
      const defaultMiddlewares = [
        addRequestIdParamToBodyParams(pathTemplate, this.paramDelimiter),
      ];

      this.requestHandlersUpdated[method].push({
        handler: callback,
        middlewares: new MiddlewarePipeline([
          ...defaultMiddlewares,
          ...middlewares,
        ]),
        pathTemplate,
        pathUrl: urlWithApiBase,
      });
    }
  }

  protected getRequest(method: HTTP_METHOD, url: string) {
    const pathTemplate = url.split('/').filter(Boolean);

    const request = this.requestHandlersUpdated[method].find((requestItem) => {
      if (pathTemplate.length !== requestItem.pathTemplate.length) {
        return false;
      }
      return pathTemplate.every(
        (pathItem: string, requestItemIndex: number) => {
          const isIdPattern =
            requestItem.pathTemplate[requestItemIndex].includes(
              PARAM_DELIMITER
            );
          const isPathPartsEqual =
            requestItem.pathTemplate[requestItemIndex] === pathItem;

          return isIdPattern || isPathPartsEqual;
        }
      );
    });

    return request;
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
      pathTemplate: [],
      pathUrl: url,
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
    return this.getRequest(method, url)?.handler;
  }

  protected getRequestMiddleware(method: HTTP_METHOD, url: string) {
    return this.getRequest(method, url)?.middlewares;
  }
}
