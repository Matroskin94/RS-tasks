import fsPromises from 'fs/promises';

export const readFile = async (filePath) => {
  return fsPromises
    .readFile(filePath)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log('File read error:', error);
    });
};
