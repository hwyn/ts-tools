"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgv = exports.registryProjectArgv = void 0;
var _projectArgv = function (argv) { return argv; };
var registryProjectArgv = function (projectArgv) {
    _projectArgv = projectArgv;
};
exports.registryProjectArgv = registryProjectArgv;
var getArgv = function () { return _projectArgv; };
exports.getArgv = getArgv;
