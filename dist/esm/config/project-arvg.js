let _projectArgv = (argv) => argv;
export const registryProjectArgv = (projectArgv) => {
    _projectArgv = projectArgv;
};
export const getArgv = () => _projectArgv;
