import { IRequestConfig, TRequestsMap } from './types';

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum SERVICE_ERRORS {
  REQUEST_NOT_EXISTS = 'REQUEST_NOT_EXISTS',
}

export const PARAM_DELIMITER = ':';

export const DEFAULT_REQUEST_HANDLERS: TRequestsMap<
  Record<string, IRequestConfig>
> = {
  [HTTP_METHOD.GET]: {},
  [HTTP_METHOD.POST]: {},
  [HTTP_METHOD.PUT]: {},
  [HTTP_METHOD.DELETE]: {},
};

export const DEFAULT_REQUEST_ARRAY_HANDLERS: TRequestsMap<IRequestConfig[]> = {
  [HTTP_METHOD.GET]: [],
  [HTTP_METHOD.POST]: [],
  [HTTP_METHOD.PUT]: [],
  [HTTP_METHOD.DELETE]: [],
};
