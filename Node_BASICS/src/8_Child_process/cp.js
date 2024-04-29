import { spawn } from 'node:child_process';

const spawnChildProcess = async (args) => {
  const childProcess = spawn(
    'node ./src/8_Child_process/files/script.js',
    args,
    { stdio: [process.stdin, process.stdout], shell: true }
    // `subprocess.stdin`,`subprocess.stdout`, and `subprocess.stderr`
  );
};

spawnChildProcess(['arg1']);
