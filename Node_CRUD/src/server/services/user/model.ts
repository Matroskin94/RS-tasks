import Joi from "@hapi/joi";

import { APP_ENTITIES } from "../../constants/appEntities";
import { FileService } from "../../utils/FileService/FileService";

export const userModel = new FileService({ entity: APP_ENTITIES.USERS });

export const userSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string(),
});
