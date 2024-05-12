import { APP_ENTITIES } from '../../constants/appEntities';
import { FileService } from '../../utils/FileService/FileService';

export const userModel = new FileService({ entity: APP_ENTITIES.USERS });
