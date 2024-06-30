var _projectArgv = function (argv) { return argv; };
export var registryProjectArgv = function (projectArgv) {
    _projectArgv = projectArgv;
};
export var getArgv = function () { return _projectArgv; };
