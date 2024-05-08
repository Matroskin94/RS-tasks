import { SERVER_CONFIG } from './constants/configs';
import { API_BASE } from './constants/api';
import { NetworkService } from './utils/NetworkService/NetworkService';

export const serverStart = () => {
  const networkService = new NetworkService({
    apiBase: API_BASE,
    port: SERVER_CONFIG.PORT,
  });

  networkService.get('/users', (req, res) => {
    res.statusCode = 200;
    res.end();
  });
};
