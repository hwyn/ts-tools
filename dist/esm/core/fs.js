import { __awaiter } from "tslib";
import { rm, rmdir, existsSync, mkdir as fsMkdir, writeFile as fsWriteFile } from 'fs';
export const exists = (path) => {
    return Promise.resolve(existsSync(path));
};
export const cleanDir = (path, options) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (!existsSync(path)) {
            return resolve(null);
        }
        (rm || rmdir)(path, { recursive: true }, (error) => {
            if (error) {
                return reject(`clear dir error: ${path}`);
            }
            resolve(null);
        });
    });
});
export const mkdir = (path, options) => __awaiter(void 0, void 0, void 0, function* () {
    return cleanDir(path).then(() => {
        return new Promise((resolve, reject) => {
            fsMkdir(path, Object.assign({ recursive: true }, options), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(null);
            });
        });
    });
});
export const writeFile = (path, data, options) => __awaiter(void 0, void 0, void 0, function* () {
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
});
export const requireSync = (path) => {
    if (!existsSync(path)) {
        return;
    }
    return require(path);
};
