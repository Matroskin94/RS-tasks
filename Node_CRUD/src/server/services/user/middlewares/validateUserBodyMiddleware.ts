import { TMiddleware } from '../../../utils/MiddlewarePipeline/types';
import {
  IServiceRequest,
  IServiceResponse,
} from '../../../utils/NetworkService/types';
import { userSchema } from '../model';

export const validateUserBodyMiddleware: TMiddleware<
  IServiceRequest,
  IServiceResponse
> = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    res.statusCode = 400;
    res.write(error.details[0].message);
    res.end();
  } else {
    next();
  }
};
