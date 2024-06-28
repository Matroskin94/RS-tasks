import { IncomingMessage, ServerResponse } from 'http';
import { HTTP_METHOD } from './constants';
import { MiddlewarePipeline } from '../MiddlewarePipeline/MiddlewarePipeline';

export interface IServiceRequest extends IncomingMessage {
  body?: any;
  params?: Record<string, string>;
}

export interface IServiceResponse extends ServerResponse<IncomingMessage> {
  req: IncomingMessage;
}

export interface IServiceMessageResult<TResult> {
  result: TResult;
  req: IServiceRequest;
  res: IServiceResponse;
}

export type TRequestHandler = (
  request: IServiceRequest,
  response: IServiceResponse
) => void;

export interface IRequestConfig {
  handler: TRequestHandler;
  middlewares: MiddlewarePipeline<IServiceRequest, IServiceResponse> | null;
  pathTemplate: string[];
  pathUrl: string;
}

export type TRequestsMap<TEntityType> = Record<HTTP_METHOD, TEntityType>;
