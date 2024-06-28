import { TNext } from "../MiddlewarePipeline/types";
import { IServiceRequest, IServiceResponse } from "../NetworkService/types";

export const addRequestIdParamToBodyParams =
  (pathTemplate: string[], paramDelimiter: string) =>
  (
    request: IServiceRequest,
    response: IServiceResponse,
    next: TNext<IServiceRequest, IServiceResponse>
  ) => {
    return new Promise<void>((resolve) => {
      let requestParams = request?.params || {};
      const paramIndex = pathTemplate.findIndex((item) =>
        item.includes(paramDelimiter)
      );
      const path = request?.url?.split("/").filter(Boolean) || [];

      if (paramIndex !== -1) {
        const paramName = pathTemplate[paramIndex].slice(1);

        requestParams = {
          ...requestParams,
          [paramName]: path[paramIndex],
        };
      }

      (request as IServiceRequest).params = requestParams;
      resolve();
    }).then(() => {
      next();
    });
  };
