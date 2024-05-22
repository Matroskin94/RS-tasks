import { v4 as uuidV4 } from "uuid";

import {
  IServiceRequest,
  IServiceResponse,
} from "../../utils/NetworkService/types";
import { userModel, userSchema } from "./model";

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
  } catch (e) {
    console.log("Get suer by id error: ", e);

    res.statusCode = 500;
    res.write("Internal server error");
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
    console.log("Create user error: ", e);

    res.statusCode = 500;
    res.write("Internal server error");
    res.end();
  }
};
