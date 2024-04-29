import fs from 'fs'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { createGzip } from 'zlib'

export const compressGzip = async (inputFilePath, outputFilePath) => {
  const pipe = promisify(pipeline)
  const inputFileReadStream = fs.createReadStream(inputFilePath)
  const outputFileWriteStream = fs.createWriteStream(outputFilePath)
  const gzipStream = createGzip()

  await pipe(inputFileReadStream, gzipStream, outputFileWriteStream)
}