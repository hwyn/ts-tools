import rimraf from 'rimraf';
import { existsSync, mkdir as fsMkkdir, writeFile as fsWriteFile } from 'fs';
export const exists = (path) => {
    return Promise.resolve(existsSync(path));
};
export const cleanDir = async (path, options) => new Promise((resolve, reject) => {
    if (!existsSync(path)) {
        return resolve(null);
    }
    rimraf(path, { glob: options, }, (err) => {
        if (err) {
            return reject(err);
        }
        resolve(null);
    });
});
export const mkdir = async (path, options) => cleanDir(path).then(() => {
    return new Promise((resolve, reject) => {
        fsMkkdir(path, Object.assign({ recursive: true }, options), (err) => {
            if (err) {
                return reject(err);
            }
            resolve(null);
        });
    });
});
export const writeFile = async (path, data, options) => {
    let _code = data;
    if (data instanceof String) {
        _code = new Buffer(data);
    }
    return new Promise((resolve, reject) => {
        fsWriteFile(path, _code, Object.assign({ encoding: 'utf-8' }, options), (err) => {
            if (err) {
                return reject();
            }
            resolve(path);
        });
    });
};
export const requireSync = (path) => {
    if (!existsSync(path)) {
        return;
    }
    return require(path);
};
