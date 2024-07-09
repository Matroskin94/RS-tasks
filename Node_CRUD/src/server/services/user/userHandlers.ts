import { v4 as uuidV4 } from "uuid";

import {
  IServiceRequest,
  IServiceResponse,
} from "../../utils/NetworkService/types";
import { userModel, userSchema } from "./model";
import { errorCodes } from '../../constants/errorCodes';

export const findAllUsers = (req: IServiceRequest, res: IServiceResponse) => {
  userModel
    .findAll()
    .then((entityContent) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(entityContent));
      res.end();
    })
    .catch((e) => {
      console.log("Find all users error: ", e);

      res.statusCode = 500;
      res.write("Internal server error");
      res.end();
    });
};

export const getUserById = async (
  req: IServiceRequest,
  res: IServiceResponse
) => {
  try {
    return userModel
      .getByKey('id', req?.params?.userId || '')
      .then((entityContent) => {
        if (!entityContent.length) {
          return Promise.reject({ code: 404, message: 'User not found' });
        }

        res.statusCode = 200;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(entityContent));
        res.end();
      });
  } catch (e) {
    console.log('Get user by id error: ', e);

    res.statusCode = 500;
    res.write('Internal server error');
    res.end();
  }
};

export const createUser = async (
  req: IServiceRequest,
  res: IServiceResponse
) => {
  try {
    const user = {
      id: uuidV4(),
      ...req.body,
    };
    await userModel.createItem(user);

    res.statusCode = 201;
    res.end();
  } catch (e) {
    console.log('Create user error: ', e);

    res.statusCode = 500;
    res.write('Internal server error');
    res.end();
  }
};

export const updateUser = async (
  req: IServiceRequest,
  res: IServiceResponse
) => {
  try {
    const user = req.body;

    await userModel.updateItemById(req?.params?.userId || '', user);

    res.statusCode = 200;
    res.end();
  } catch (e) {
    console.log('Update user error: ', e);
    if (errorCodes.NOT_FOUND === e) {
      return Promise.reject({ code: 404, message: 'User not found' });
    }
    res.statusCode = 500;
    res.write('Internal server error');
    res.end();
  }
};
