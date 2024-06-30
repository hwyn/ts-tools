import { __awaiter, __generator } from "tslib";
import { rm, rmdir, existsSync, mkdir as fsMkdir, writeFile as fsWriteFile } from 'fs';
export var exists = function (path) {
    return Promise.resolve(existsSync(path));
};
export var cleanDir = function (path, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                if (!existsSync(path)) {
                    return resolve(null);
                }
                (rm || rmdir)(path, { recursive: true }, function (error) {
                    if (error) {
                        return reject("clear dir error: ".concat(path));
                    }
                    resolve(null);
                });
            })];
    });
}); };
export var mkdir = function (path, options) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, cleanDir(path).then(function () {
                return new Promise(function (resolve, reject) {
                    fsMkdir(path, Object.assign({ recursive: true }, options), function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(null);
                    });
                });
            })];
    });
}); };
export var writeFile = function (path, data, options) { return __awaiter(void 0, void 0, void 0, function () {
    var _code;
    return __generator(this, function (_a) {
        _code = data;
        if (data instanceof String) {
            _code = new Buffer(data);
        }
        return [2 /*return*/, new Promise(function (resolve, reject) {
                fsWriteFile(path, _code, Object.assign({ encoding: 'utf-8' }, options), function (err) {
                    if (err) {
                        return reject();
                    }
                    resolve(path);
                });
            })];
    });
}); };
export var requireSync = function (path) {
    if (!existsSync(path)) {
        return;
    }
    return require(path);
};
