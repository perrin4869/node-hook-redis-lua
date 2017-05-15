# node-hook-redis-lua

[![Greenkeeper badge](https://badges.greenkeeper.io/perrin4869/node-hook-redis-lua.svg)](https://greenkeeper.io/)

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
import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';
import { hook, unhook } from 'hook-redis-lua';

hook();
const pdel = require('./pdel.lua');
const ioredis = new Redis();
pdel.install(ioredis); // accepts extra parameters: { name, numberOfKeys }

ioredis.pdel('*');

console.log(pdel.name); // pdel
console.log(pdel.numberOfKeys); // 1
console.log(pdel.lua); // the content of pdel.lua

unhook(); // can't require lua scripts from here
```

Note: supports Node 4+

## API

### hook({ useFilenameAsName })

Hooks `.lua` files to be parsed when called by `require` with [redis-lua2js](https://github.com/perrin4869/redis-lua2js)

#### useFilenameAsName

Type: `boolean`, default: `true`, whether or not use the `lua` script file basename as the name for the script, useful when installing into `ioredis`

### unhook()

Removes `.lua` hooks from `require`

For details on the properties exported by the hook, check [redis-lua2js](https://github.com/perrin4869/redis-lua2js).

####

## Tests

```bash
npm test
```

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[build-badge]: https://img.shields.io/travis/perrin4869/node-hook-redis-lua/master.svg?style=flat-square
[build]: https://travis-ci.org/perrin4869/node-hook-redis-lua

[npm-badge]: https://img.shields.io/npm/v/hook-redis-lua.svg?style=flat-square
[npm]: https://www.npmjs.org/package/hook-redis-lua

[coveralls-badge]: https://img.shields.io/coveralls/perrin4869/node-hook-redis-lua/master.svg?style=flat-square
[coveralls]: https://coveralls.io/r/perrin4869/node-hook-redis-lua

[dependency-status-badge]: https://david-dm.org/perrin4869/node-hook-redis-lua.svg?style=flat-square
[dependency-status]: https://david-dm.org/perrin4869/node-hook-redis-lua

[dev-dependency-status-badge]: https://david-dm.org/perrin4869/node-hook-redis-lua/dev-status.svg?style=flat-square
[dev-dependency-status]: https://david-dm.org/perrin4869/node-hook-redis-lua#info=devDependencies
