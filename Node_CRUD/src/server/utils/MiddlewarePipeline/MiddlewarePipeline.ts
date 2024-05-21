// Middleware explanation
// https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/

import { TMiddleware } from './types';

// Middlewares are good for request validation and error handling
// In this task it usefull for request validation
// Link for req.body validation: https://medium.com/@techsuneel99/validate-incoming-requests-in-node-js-like-a-pro-95fbdff4bc07
// Link for Middleware/Mediator pattern: https://www.patterns.dev/vanilla/mediator-pattern/
// Link for Mediator implementation: https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/

export class MiddlewarePipeline<TReq, TRes> {
  private pipelineMiddlewares: TMiddleware<TReq, TRes>[] = [];
  constructor(middlewares: TMiddleware<TReq, TRes>[]) {
    this.pipelineMiddlewares = middlewares;
  }

  push(...middlewares: TMiddleware<TReq, TRes>[]) {
    this.pipelineMiddlewares.push(...middlewares);
  }

  async execute(req: TReq, res: TRes) {
    let prevIndex = -1;

    const runner = async (index: number): Promise<[TReq, TRes]> => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times');
      }

      prevIndex = index;
      const currentMiddleWare = this.getMiddleWareByIndex(index);

      if (currentMiddleWare) {
        return new Promise<number>((resolve) => {
          currentMiddleWare(req, res, () => {
            resolve(index + 1);
          });
        }).then((ind: number) => {
          return runner(ind);
        });
      } else {
        return Promise.resolve([req, res]);
      }
    };

    return await runner(0);
  }

  protected getMiddleWareByIndex(middlewareIndex: number) {
    return this.pipelineMiddlewares[middlewareIndex];
  }
}
