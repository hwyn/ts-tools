import rimraf from 'rimraf';
import { existsSync, mkdir as fsMkkdir, writeFile as fsWriteFile } from 'fs';

export const exists = (path: string): Promise<boolean> => {
  return Promise.resolve(existsSync(path));
}

export const cleanDir = async (path: string, options: any = {}): Promise<undefined> => new Promise((resolve, reject) => {
  if (!existsSync(path)) {
    return resolve();
  }
  rimraf(path, { glob: options, }, (err) => {
    if (err) {
      return reject(err);
    }
    resolve();
  });
});

export const mkdir = async (path: string, options: any = {}): Promise<any> => cleanDir(path).then(() => {
  return new Promise((resolve, reject) => {
    fsMkkdir(path, Object.assign({ recursive: true }, options), (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
});


export const writeFile = async (path: string, data: Buffer | string, options: any = {}): Promise<string> => {
  let _code = data;
  if (data instanceof String) {
    _code = new Buffer(data as string);
  }
  return new Promise((resolve, reject) => {
    fsWriteFile(path, _code, Object.assign({ encoding: 'utf-8' }, options), (err) => {
      if(err) {
        return reject();
      }
      resolve(path);
    });
  })
};

export const requireSync = (path: string) => {
  if (!existsSync(path)) {
    return ;
  }
  const moduleRequire = require(path);
  return moduleRequire;
};