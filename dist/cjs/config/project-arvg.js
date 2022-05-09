"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgv = exports.registryProjectArgv = void 0;
let _projectArgv = (argv) => argv;
const registryProjectArgv = (projectArgv) => {
    _projectArgv = projectArgv;
};
exports.registryProjectArgv = registryProjectArgv;
const getArgv = () => _projectArgv;
exports.getArgv = getArgv;
