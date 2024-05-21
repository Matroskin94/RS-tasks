import { IncomingMessage, ServerResponse } from 'http';
import { HTTP_METHOD } from './constants';
import { MiddlewarePipeline } from '../MiddlewarePipeline/MiddlewarePipeline';

export interface IServiceRequest extends IncomingMessage {
  body?: any;
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

interface IRequestConfig {
  handler: TRequestHandler;
  middlewares: MiddlewarePipeline<IServiceRequest, IServiceResponse> | null;
}

export type TRequestsMap = Record<HTTP_METHOD, Record<string, IRequestConfig>>;
