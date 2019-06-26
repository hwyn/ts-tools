import config from '../config';

const { baseDir } = config;

export default {
  context: baseDir,
  stats: {
    colors: true,
    hash: true, // required by custom stat output
    timings: true, // required by custom stat output
    chunks: true, // required by custom stat output
    chunkModules: false,
    modules: false,
    reasons: false,
    warnings: true,
    errors: true,
    assets: true, // required by custom stat output
    version: false,
    errorDetails: false,
    moduleTrace: false,
  },
};