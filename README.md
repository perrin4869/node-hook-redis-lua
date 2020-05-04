# node-hook-redis-lua

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coverage Status][coveralls-badge]][coveralls]
[![Dependency Status][dependency-status-badge]][dependency-status]
[![devDependency Status][dev-dependency-status-badge]][dev-dependency-status]

> import redis lua scripts as a normal node module

## Install

```
$ npm install --save hook-redis-lua
```

## Usage

If you have a redis lua script in your project, you can load it and install it into `ioredis` clients, or any other client, as follows:

pdel.lua:
```lua
--!/usr/bin/env lua
-- name pdel
-- nkeys 1

local function deleteKeys (keys)
  for i, name in ipairs(keys) do
    redis.call("DEL", name)
  end
end

if type(redis.replicate_commands) == 'function' and redis.replicate_commands() then -- Redis 3.2+
  local count = 0
  local cursor = "0"
  local keys

  repeat
    cursor, keys = unpack(redis.call("SCAN", cursor, "MATCH", KEYS[1]))
    count = count + #keys
    deleteKeys(keys)
  until cursor == "0"

  return count
else
  local keys = redis.call("KEYS", KEYS[1])
  deleteKeys(keys)
  return #keys
end
```

index.js:
```js
const Redis = require('ioredis');
const fs = require('fs');
const { hook, unhook } = require('hook-redis-lua');

hook(); // Uses default redis-lua2js behavior for parsing name and numberOfKeys out of lua comments

const pdel = require('./pdel.lua');
const ioredis = new Redis();
ioredis.defineCommand(pdel.name, {
  lua: pdel.lua,
  numberOfKeys: pdel.numberOfKeys,
});

ioredis.pdel('*');

console.log(pdel.name); // pdel
console.log(pdel.numberOfKeys); // 1
console.log(pdel.lua); // the content of pdel.lua

unhook(); // can't require lua scripts from here
```

## API

### hook({ name, numberOfKeys })

Hooks `.lua` files to be parsed when called by `require` with [redis-lua2js](https://github.com/dotcore64/redis-lua2js)

#### name

Type: `any | (filename: string, source: string) => any`, default: `undefined`

How to determine the name of the lua script. If undefined, it will use the default `redis-lua2js` behavior of parsing lua comments for the name.
If a constant is passed, it will use this constant for the name of all scripts.
If a function is passed, it will be used to determine the name of the script. The function must be synchronous.

Example: `(filename) => path.basename(filename, path.extname(filename))`

#### numberOfKeys

Type: `any | (filename: string, source: string) => any`, default: `undefined`

How to determine the number of keys of the lua script. If undefined, it will use the default `redis-lua2js` behavior of parsing lua comments for the number of keys.
If a constant is passed, it will use this constant for the number of keys of all scripts.
If a function is passed, it will be used to determine the number of keys of the script. The function must be synchronous.

Example: `(filename, source) => getNumberOfKeysSomehow(source)`

### unhook()

Removes `.lua` hooks from `require`

For details on the properties exported by the hook, check [redis-lua2js](https://github.com/dotcore64/redis-lua2js).

####

## Tests

```bash
npm test
```

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/travis/dotcore64/node-hook-redis-lua/master.svg?style=flat-square
[build]: https://travis-ci.org/dotcore64/node-hook-redis-lua

[npm-badge]: https://img.shields.io/npm/v/hook-redis-lua.svg?style=flat-square
[npm]: https://www.npmjs.org/package/hook-redis-lua

[coveralls-badge]: https://img.shields.io/coveralls/dotcore64/node-hook-redis-lua/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/dotcore64/node-hook-redis-lua

[dependency-status-badge]: https://david-dm.org/dotcore64/node-hook-redis-lua.svg?style=flat-square
[dependency-status]: https://david-dm.org/dotcore64/node-hook-redis-lua

[dev-dependency-status-badge]: https://david-dm.org/dotcore64/node-hook-redis-lua/dev-status.svg?style=flat-square
[dev-dependency-status]: https://david-dm.org/dotcore64/node-hook-redis-lua#info=devDependencies
