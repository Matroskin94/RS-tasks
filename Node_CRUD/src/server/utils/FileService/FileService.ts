import path from 'path';
import fs from 'fs';
import fsPromise from 'fs/promises';

import { APP_ENTITIES } from '../../constants/appEntities';

export class FileService {
  protected entity: APP_ENTITIES;
  protected filePath: string;
  constructor({ entity }: { entity: APP_ENTITIES }) {
    this.entity = entity;
    this.filePath = path.join('src', 'server', 'store', 'store.json');
  }

  async findAll() {
    return await this.readEntityFromFile();
  }

  async getByKey(key: string, value: string | number | boolean) {
    const entities = await this.readEntityFromFile().then((allEntities) => {
      const resultEntities = allEntities.filter(
        (entity) => entity[key] === value
      );

      return resultEntities;
    });

    return entities;
  }

  async createItem(body: any) {
    try {
      const fileContent = await this.readFileContent();
      const { [this.entity]: currentEntity, ...restFile } = fileContent;

      currentEntity.push(JSON.parse(body));

      const finalFileData = JSON.stringify(
        {
          [this.entity]: currentEntity,
          ...restFile,
        },
        null,
        2
      );
      await fsPromise.writeFile(this.filePath, finalFileData);
    } catch (e) {
      console.log('FileService, createItem error: ', e);

      throw new Error('FileService: Create item error');
    }
  }

  protected async readFileContent() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error('File not found');
    }

    try {
      const fileContent = await fsPromise.readFile(this.filePath, 'utf-8');
      const parsedContent = JSON.parse(fileContent);

      return parsedContent;
    } catch (e) {
      throw new Error('Reading file error');
    }
  }

  protected async readEntityFromFile(): Promise<any[]> {
    try {
      const fileContent = await this.readFileContent();

      return fileContent[this.entity] || [];
    } catch (e) {
      console.log('FileService: readEntityFromFile, error', e)

      throw new Error(`FileService: read entity from file error: ${e}`);
    }
  }
}
