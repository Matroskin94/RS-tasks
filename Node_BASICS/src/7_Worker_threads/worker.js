import { parentPort, workerData } from 'node:worker_threads';
import { nthFibonacci } from './utils/nthFibonacci.js';

const sendResult = () => {
  const result = nthFibonacci(+workerData.count);

  parentPort.postMessage(result);
};

sendResult();
