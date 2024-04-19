const parseEnv = () => {
  Object.keys(process.env).forEach((currentKey) => {
    if (currentKey.startsWith('RSS_')) {
      console.log(`${currentKey}=${process.env[currentKey]}`);
    }
  });
};

parseEnv();
