import { TMiddleware } from '../../../utils/MiddlewarePipeline/types';
import {
  IServiceRequest,
  IServiceResponse,
} from '../../../utils/NetworkService/types';
import { userSchema } from '../model';

export const validateUserBodyMiddleware: TMiddleware<
  IServiceRequest,
  IServiceResponse
> = async (req, res, next) => {
  await userSchema
    .validate(req.body)
    .then((res) => {
      next();
    })
    .catch((error) => {
      const validationError = error.toString();

      console.log('User object validation error: ', validationError);

      res.statusCode = 400;
      res.write(validationError);
      res.end();
    });
};
