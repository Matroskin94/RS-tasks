import { SERVER_CONFIG } from './constants/configs';
import { API, API_BASE } from './constants/api';
import { NetworkService } from './utils/NetworkService/NetworkService';
import {
  createUser,
  findAllUsers,
  getUserById,
} from './services/user/userHandlers';
import { validateUserBodyMiddleware } from './services/user/middlewares/validateUserBodyMiddleware';
import { validateUuidIdParam } from './utils/middlewares/validateUuidIdParam';

export const serverStart = () => {
  const networkService = new NetworkService({
    apiBase: API_BASE,
    port: Number(SERVER_CONFIG.PORT) || 4430,
  });

  networkService.get(API.users, findAllUsers);
  networkService.get(`${API.users}/:userId`, getUserById, [
    validateUuidIdParam('userId'),
  ]);
  networkService.post(API.users, createUser, [validateUserBodyMiddleware]);
};
