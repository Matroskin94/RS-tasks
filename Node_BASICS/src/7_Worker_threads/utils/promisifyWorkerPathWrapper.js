import { Worker } from 'node:worker_threads'

export const promisifyWorkerPathWrapper = (workerPath) => (count) => {
  return new Promise((resolve, reject) => {
    const workerStartTime = new Date()
    const worker = new Worker(workerPath, {
      workerData: {
        count: count,
      },
    });

    worker.on('message', (message) => {
      console.log('Worker calculateTime: ', new Date() - workerStartTime)
      resolve({
        status: 'resolved',
        data: message,
      });
    });
    worker.on('error', (error) => {
      reject({
        status: 'error',
        data: error,
      });
    });
  });
};