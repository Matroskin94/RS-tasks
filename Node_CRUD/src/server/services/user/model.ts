import { InferType, object, string } from 'yup';

import { APP_ENTITIES } from '../../constants/appEntities';
import { FileService } from '../../utils/FileService/FileService';

export const userSchema = object()
  .shape({
    name: string().required(),
    surname: string(),
  })
  .noUnknown(true)
  .required()
  .strict();

export type TUserSchema = InferType<typeof userSchema> & { id: string };

export const userModel = new FileService<TUserSchema>({
  entity: APP_ENTITIES.USERS,
});
