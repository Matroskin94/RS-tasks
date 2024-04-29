import os from 'os';

import { nthFibonacci } from './utils/nthFibonacci.js';
import { promisifyWorkerPathWrapper } from './utils/promisifyWorkerPathWrapper.js';

/* 
  Current machine CPU info:
  12 cores
  {
    model: 'Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz',
    speed: 2600,
    times: {
      user: 165536320,
      nice: 0,
      sys: 71580660,
      idle: 615717630,
      irq: 0
    }
  }
  Pay attention, that if we work with calculating numbers 10, ..., 22, there is no reasons to use separate threads,
  because single core works with this task for 1ms, and for worker, for each number, system creates worker thread,
  and it takes near 140ms, so there is much slower for such easy calculation.
  But if we get for example fibonacci numbers for array 30, ..., 42, then the result much better for divided threads.
  Total time for 12 threads: near 3000ms
  Total time for 1 thread: near 6900ms

  So, while using worker threads, need to remember, that not for each operation it works faster, because it needs some time
  to create worker and work with it.
*/
const COMPLEXITY_BASE = 10

const performCalculations = async () => {
  const cpuCount = os.cpus().length;
  const promisifyWorker = promisifyWorkerPathWrapper(
    './src/7_Worker_threads/worker.js'
  );

  const inputNumbers = Array.from(Array(cpuCount).keys()).map(
    (itemIndex) => itemIndex + COMPLEXITY_BASE
  );
  const fibonacciWorkerTimeStart = new Date();
  const promises = inputNumbers.map((inputNumber) =>
    promisifyWorker(inputNumber)
  );

  const fibonacciWorkerNumbers = await Promise.all(promises);
  const fibonacciWorkerTimeEnd = new Date();

  console.log(
    'Workers Calculate time: ',
    fibonacciWorkerTimeEnd - fibonacciWorkerTimeStart
  );
  console.log('fibonacciNumbers', fibonacciWorkerNumbers);

  const fibonacciThreadTimeStart = new Date();
  const fibonacciThreadNumbers = inputNumbers.map((inputNumber) =>
    nthFibonacci(inputNumber)
  );
  const fibonacciThreadTimeEnd = new Date();

  console.log(
    'SingleThread calculate time: ',
    fibonacciThreadTimeEnd - fibonacciThreadTimeStart
  );
  console.log('fibonacciThreadNumbers', fibonacciThreadNumbers);
};

await performCalculations();
