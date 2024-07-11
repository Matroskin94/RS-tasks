import path from 'path';
import fs from 'fs';
import fsPromise from 'fs/promises';

import { APP_ENTITIES } from '../../constants/appEntities';
import { errorCodes } from '../../constants/errorCodes';

export class FileService<TEntity extends { id: string }> {
  protected entity: APP_ENTITIES;
  protected filePath: string;
  constructor({ entity }: { entity: APP_ENTITIES }) {
    this.entity = entity;
    this.filePath = path.join('src', 'server', 'store', 'store.json');
  }

  async findAll() {
    return await this.readEntityFromFile();
  }

  async getByKey(key: keyof TEntity, value: string | number | boolean) {
    const entities = await this.readEntityFromFile().then((allEntities) => {
      const resultEntities = allEntities.filter(
        (entity) => entity[key] === value
      );

      return resultEntities;
    });

    return entities;
  }

  async createItem(body: TEntity) {
    try {
      const fileContent = await this.readFileContent();
      const { [this.entity]: currentEntity = [] } = fileContent;

      currentEntity.push(body);

      await this.writeEntityContent(currentEntity);
    } catch (e) {
      console.log('FileService, createItem error: ', e);

      throw new Error('FileService: Create item error');
    }
  }

  async deleteItemById(id: string) {
    try {
      const fileContent = await this.readFileContent();
      let isItemExist = false;

      const updatedEntities = fileContent[this.entity].filter(
        (entity: TEntity) => {
          if (entity.id === id) {
            isItemExist = true;
          }

          return entity.id !== id;
        }
      );

      if (isItemExist) {
        this.writeEntityContent(updatedEntities);
      } else {
        return Promise.reject(errorCodes.NOT_FOUND);
      }
    } catch (e) {
      console.log('FileService, deleteItemById error: ', e);
    }
  }

  async updateItemById(id: string, body: Partial<TEntity>) {
    try {
      const fileContent = await this.readFileContent();
      let isItemExist = false;

      const updatedEntities = fileContent[this.entity].map(
        (entity: TEntity) => {
          if (entity.id === id) {
            isItemExist = true;
            return { ...entity, ...body };
          }

          return entity;
        }
      );

      if (isItemExist) {
        this.writeEntityContent(updatedEntities);
      } else {
        return Promise.reject(errorCodes.NOT_FOUND);
      }
    } catch (e) {
      console.log('FileService, updateItemById error: ', e);
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

  protected async writeEntityContent(content: TEntity[]) {
    const fileContent = await this.readFileContent();
    const { [this.entity]: _currentEntity, ...restFile } = fileContent;
    const finalFileData = JSON.stringify(
      {
        [this.entity]: content,
        ...restFile,
      },
      null,
      2
    );
    await fsPromise.writeFile(this.filePath, finalFileData);
  }

  protected async readEntityFromFile(): Promise<TEntity[]> {
    try {
      const fileContent = await this.readFileContent();

      return fileContent[this.entity] || [];
    } catch (e) {
      console.log('FileService: readEntityFromFile, error', e);

      throw new Error(`FileService: read entity from file error: ${e}`);
    }
  }
}
