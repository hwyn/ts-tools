import fs, { existsSync } from 'fs';
import path from 'path';

export interface Source<T> {
  javascript: Array<T>;
  styleSheet: Array<T>;
}

type serialization = () => Source<string>;
const baseDir = process.cwd();

function getAssets() {
  const assets = JSON.parse(fs.readFileSync(path.join(baseDir, 'build/assets.json'), { encoding: 'utf-8' }));
  let dll = {};
  if (existsSync(path.join(baseDir, '../../build/dll.json'))) {
    dll = JSON.parse(fs.readFileSync(path.join(baseDir, 'build/dll.json'), { encoding: 'utf-8' }));
  }
  return {
    ...dll,
    ...assets,
  };
}

const serializationSource = (source: any) => Object.keys(source).reduce((o: Source<string>, key): Source<string> => {
  let __source;
  if (!key || !(__source = source[key])) {
    return o as Source<string>;
  }
  const javascript = [].concat(__source.js || []).map((path: string) => `<script src="/${path}"></script>`);
  const styleSheet = [].concat(__source.css || []).map((path: string) => `<link rel="stylesheet" href="/${path}">`);
  return Object.assign({
    javascript: o.javascript.concat(javascript),
    styleSheet: o.styleSheet.concat(styleSheet),
  });
}, { javascript:[], styleSheet: [] } as Source<string>);

const getResource = ((): serialization => {
  let json: Source<string>;
  return (): Source<string> => json ? json : json = serializationSource(getAssets());
})();

export default getResource;
