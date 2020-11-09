import webpack from 'webpack';
import merge from 'webpack-merge';
import { happypackMerge } from '../../core/happypack';
import baseConfig from './webpack.base.config';

const hotPlug = (key: string) => `webpack-hot-middleware/client?name=${key}&reload=true`;

export default () => {
  const config = baseConfig();
  const { entry } = config;
  const { output: { filename = '' } = {} } = config;
  delete config.entry;

  return happypackMerge(merge(config, {
    mode: 'development',
    entry: Object.keys(entry).reduce((obj, key) => Object.assign(obj, {
      [key]: Array.isArray(entry[key]) ? (entry[key].push(hotPlug(key)), entry[key]) : [hotPlug(key), entry[key]],
    }), {}),
    output: {
      filename: filename.replace('\.[hash:8]', ''),
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'development'"
      }),
    ],
    devtool: 'source-map',
  }));
}
