import crypto from 'crypto';

export const getHash = (contentString) => {
  const hash = crypto.createHash('SHA256');
  hash.setEncoding('hex');
  hash.write(contentString);
  hash.read();
  hash.end();

  const sha256sum = hash.read();

  return sha256sum;
};
