"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSync = exports.writeFile = exports.mkdir = exports.cleanDir = exports.exists = void 0;
const fs_1 = require("fs");
const exists = (path) => {
    return Promise.resolve((0, fs_1.existsSync)(path));
};
exports.exists = exists;
const cleanDir = async (path, options) => new Promise((resolve, reject) => {
    if (!(0, fs_1.existsSync)(path)) {
        return resolve(null);
    }
    (fs_1.rm || fs_1.rmdir)(path, { recursive: true }, (error) => {
        if (error) {
            return reject(`clear dir error: ${path}`);
        }
        resolve(null);
    });
});
exports.cleanDir = cleanDir;
const mkdir = async (path, options) => (0, exports.cleanDir)(path).then(() => {
    return new Promise((resolve, reject) => {
        (0, fs_1.mkdir)(path, Object.assign({ recursive: true }, options), (err) => {
            if (err) {
                return reject(err);
            }
            resolve(null);
        });
    });
});
exports.mkdir = mkdir;
const writeFile = async (path, data, options) => {
    let _code = data;
    if (data instanceof String) {
        _code = new Buffer(data);
    }
    return new Promise((resolve, reject) => {
        (0, fs_1.writeFile)(path, _code, Object.assign({ encoding: 'utf-8' }, options), (err) => {
            if (err) {
                return reject();
            }
            resolve(path);
        });
    });
};
exports.writeFile = writeFile;
const requireSync = (path) => {
    if (!(0, fs_1.existsSync)(path)) {
        return;
    }
    return require(path);
};
exports.requireSync = requireSync;
