import path from 'path';
import { expect } from 'chai';
import { hook, unhook } from '../src';

describe('redis-lua-hook', () => {
  afterEach(() => {
    unhook();
    delete require.cache[path.join(__dirname, 'test.lua')];
  });

  it('loads lua using filenames as names', () => {
    hook();

    const lua = require('./test.lua');
    expect(lua.name).to.equal('test');
  });

  it('loads lua without using filenames as names', () => {
    hook({ useFilenameAsName: false });

    const lua = require('./test.lua');
    expect(lua.name).to.equal('pdel');
  });
});
