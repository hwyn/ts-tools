"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSync = exports.writeFile = exports.mkdir = exports.cleanDir = exports.exists = void 0;
const tslib_1 = require("tslib");
const rimraf_1 = tslib_1.__importDefault(require("rimraf"));
const fs_1 = require("fs");
exports.exists = (path) => {
    return Promise.resolve(fs_1.existsSync(path));
};
exports.cleanDir = async (path, options) => new Promise((resolve, reject) => {
    if (!fs_1.existsSync(path)) {
        return resolve(null);
    }
    rimraf_1.default(path, { glob: options, }, (err) => {
        if (err) {
            return reject(err);
        }
        resolve(null);
    });
});
exports.mkdir = async (path, options) => exports.cleanDir(path).then(() => {
    return new Promise((resolve, reject) => {
        fs_1.mkdir(path, Object.assign({ recursive: true }, options), (err) => {
            if (err) {
                return reject(err);
            }
            resolve(null);
        });
    });
});
exports.writeFile = async (path, data, options) => {
    let _code = data;
    if (data instanceof String) {
        _code = new Buffer(data);
    }
    return new Promise((resolve, reject) => {
        fs_1.writeFile(path, _code, Object.assign({ encoding: 'utf-8' }, options), (err) => {
            if (err) {
                return reject();
            }
            resolve(path);
        });
    });
};
exports.requireSync = (path) => {
    if (!fs_1.existsSync(path)) {
        return;
    }
    return require(path);
};
