import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base.config';

const hotPlug = (key: string) => `webpack-hot-middleware/client?name=${key}&reload=true`;

export default () => {
  const config = baseConfig();
  const entry = config.entry;
  delete config.entry;
  return merge(config, {
    mode: 'development',
    entry: Object.keys(entry).reduce((obj, key) => Object.assign(obj, {
      [key]: Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [entry[key], hotPlug(key)],
    }), {}),
    output: {
      filename: config.output.filename.replace('\.[hash:8]', ''),
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'development'"
      }),
    ],
    devtool: 'source-map',
  });
}
