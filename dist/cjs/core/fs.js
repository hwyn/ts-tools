"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSync = exports.writeFile = exports.mkdir = exports.cleanDir = exports.exists = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var exists = function (path) {
    return Promise.resolve((0, fs_1.existsSync)(path));
};
exports.exists = exists;
var cleanDir = function (path, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                if (!(0, fs_1.existsSync)(path)) {
                    return resolve(null);
                }
                (fs_1.rm || fs_1.rmdir)(path, { recursive: true }, function (error) {
                    if (error) {
                        return reject("clear dir error: ".concat(path));
                    }
                    resolve(null);
                });
            })];
    });
}); };
exports.cleanDir = cleanDir;
var mkdir = function (path, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2 /*return*/, (0, exports.cleanDir)(path).then(function () {
                return new Promise(function (resolve, reject) {
                    (0, fs_1.mkdir)(path, Object.assign({ recursive: true }, options), function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(null);
                    });
                });
            })];
    });
}); };
exports.mkdir = mkdir;
var writeFile = function (path, data, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _code;
    return tslib_1.__generator(this, function (_a) {
        _code = data;
        if (data instanceof String) {
            _code = new Buffer(data);
        }
        return [2 /*return*/, new Promise(function (resolve, reject) {
                (0, fs_1.writeFile)(path, _code, Object.assign({ encoding: 'utf-8' }, options), function (err) {
                    if (err) {
                        return reject();
                    }
                    resolve(path);
                });
            })];
    });
}); };
exports.writeFile = writeFile;
var requireSync = function (path) {
    if (!(0, fs_1.existsSync)(path)) {
        return;
    }
    return require(path);
};
exports.requireSync = requireSync;
