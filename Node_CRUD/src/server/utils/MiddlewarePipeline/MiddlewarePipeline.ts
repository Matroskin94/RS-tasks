// Middleware explanation
// https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/

import { TMiddleware } from './types';

export class MiddlewarePipeline<TReq, TRes> {
  constructor(...middlewares: TMiddleware<TReq, TRes>[]) {}
}
