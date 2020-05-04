const { join, basename, extname } = require('path');
const { expect } = require('chai');
const { hook, unhook } = require('..');

const stem = (filename) => basename(filename, extname(filename));

describe('hook-redis-lua', () => {
  afterEach(() => {
    unhook();
    delete require.cache[join(__dirname, 'test.lua')];
  });

  it('loads lua with default name and numberOfKeys', () => {
    hook();

    const lua = require('./test.lua');
    expect(lua.name).to.equal('pdel');
    expect(lua.numberOfKeys).to.equal(1);
  });

  it('loads lua using constant name and numberOfKeys', () => {
    hook({
      name: 'myname',
      numberOfKeys: 2,
    });

    const lua = require('./test.lua');
    expect(lua.name).to.equal('myname');
    expect(lua.numberOfKeys).to.equal(2);
  });

  it('loads lua using filenames as names', () => {
    hook({
      name: stem,
      numberOfKeys: () => 3,
    });

    const lua = require('./test.lua');
    expect(lua.name).to.equal('test');
    expect(lua.numberOfKeys).to.equal(3);
  });
});
