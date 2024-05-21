import { SERVER_CONFIG } from './constants/configs';
import { API, API_BASE } from './constants/api';
import { NetworkService } from './utils/NetworkService/NetworkService';
import { createUser, findAllUsers } from './services/user/userHandlers';

export const serverStart = () => {
  const networkService = new NetworkService({
    apiBase: API_BASE,
    port: Number(SERVER_CONFIG.PORT) || 4430,
  });

  networkService.get(API.users, findAllUsers);
  networkService.post(API.users, createUser);
};
