# bath

A simple path template engine.

Twitter hashtag is [#bathjs](https://twitter.com/hashtag/bathjs).

This branch is for 2.x users. 1.x users: See [1.x](./tree/1.x) branch.

## Installation

```bash
$ npm install bath
```

## Usage

```ts
import assert from 'assert';
import bath from 'bath';

const { path, params } = bath('/users/:id');

assert(path({ id: '123' }) === '/users/123');
assert.deepEqual(params('/users/123'), { id: '123' });
```

```ts
import assert from 'assert';
import { path, params } from 'bath';

assert(path('/users/:id')({ id: '123' }) === '/users/123');
assert.deepEqual(params('/users/:id')('/users/123'), { id: '123' });
```

## Types

```ts
type Path = string;
type PathFn = (params?: Params) => Path;
type Params = { [key: string]: string; };
type ParamsFn = (path: Path) => Params | undefined;
type Template = string;
type bath = (tempate: Template) => {
  path: PathFn;
  params: ParamsFn;
};
```

## Badges

[![npm version][npm-badge-url]][npm-url]
[![Travis CI][travisci-badge-url]][travisci-url]

[npm-badge-url]: https://badge.fury.io/js/bath.svg
[npm-url]: https://www.npmjs.com/package/bath
[travisci-badge-url]: https://travis-ci.org/bouzuya/bath.svg?branch=master
[travisci-url]: https://travis-ci.org/bouzuya/bath

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][email]&gt; ([http://bouzuya.net][url])

[user]: https://github.com/bouzuya
[email]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
