const lua2js = require('redis-lua2js');
const { hook, unhook } = require('node-hook');

const normalize = (val) => (typeof val === 'function' ? val : (() => val));

module.exports.hook = ({ name, numberOfKeys } = {}) => {
  name = normalize(name); // eslint-disable-line no-param-reassign
  numberOfKeys = normalize(numberOfKeys); // eslint-disable-line no-param-reassign

  return hook('.lua', (source, filename) => lua2js(source, {
    name: name(filename, source),
    numberOfKeys: numberOfKeys(filename, source),
  }));
};

module.exports.unhook = () => unhook('.lua');
