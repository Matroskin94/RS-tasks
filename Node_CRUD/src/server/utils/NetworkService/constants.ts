import { TRequestsMap } from "./types";

export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export enum SERVICE_ERRORS {
  REQUEST_NOT_EXISTS = 'REQUEST_NOT_EXISTS'
}

export const DEFAULT_REQUEST_HANDLERS: TRequestsMap = {
  [HTTP_METHOD.GET]: {},
  [HTTP_METHOD.POST]: {},
  [HTTP_METHOD.PUT]: {},
  [HTTP_METHOD.DELETE]: {},
}