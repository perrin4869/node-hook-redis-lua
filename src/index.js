import path from 'path';
import lua2js from 'redis-lua2js';
import { hook as _hook, unhook as _unhook } from 'node-hook';

export function hook({ useFilenameAsName = true } = {}) {
  _hook('.lua', (source, filename) => {
    const options = {};
    if (useFilenameAsName) {
      options.name = path.basename(filename, path.extname(filename));
    }

    return lua2js(source, options);
  });
}

export function unhook() {
  _unhook('.lua');
}
