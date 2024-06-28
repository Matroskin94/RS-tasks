import { validate as validateUUID } from "uuid";

import { TNext } from "../MiddlewarePipeline/types";
import { IServiceRequest, IServiceResponse } from "../NetworkService/types";

export const validateUuidIdParam = (paramKey: string) => (
  request: IServiceRequest,
  response: IServiceResponse,
  next: TNext<IServiceRequest, IServiceResponse>
) => {
  const entityId = request?.params?.[paramKey] || "";
  const isValidUUID = validateUUID(entityId);
  
  if (!isValidUUID) {
    response.statusCode = 400;
    response.write(`Invalid ${paramKey} UUID`);
    response.end();
    return;
  }

  next();
};
