import {
  IServiceRequest,
  IServiceResponse,
} from '../../utils/NetworkService/types';
import { userModel } from './model';

export const findAllUsers = (req: IServiceRequest, res: IServiceResponse) => {
  userModel
    .findAll()
    .then((entityContent) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(entityContent));
      res.end();
    })
    .catch((e) => {
      console.log('Find all users error: ', e);

      res.statusCode = 500;
      res.write('Internal server error');
      res.end();
    });
};

export const getUserById = async (
  req: IServiceRequest,
  res: IServiceResponse
) => {};

export const createUser = async (
  req: IServiceRequest,
  res: IServiceResponse
) => {
  try {
    await userModel.createItem(req.body);

    res.statusCode = 201;
    res.end();
  } catch (e) {
    console.log('Create user error: ', e);

    res.statusCode = 500;
    res.write('Internal server error');
    res.end();
  }
};