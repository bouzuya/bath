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

const { path, params } = bath('/users/{id}');

assert.deepEqual(path({ id: '123' }), '/users/123');
assert.deepEqual(params('/users/123'), { id: '123' });
```

```ts
import assert from 'assert';
import { path, params } from 'bath';

const template = '/users/{id}';
assert.deepEqual(path(template)({ id: '123' }), '/users/123');
assert.deepEqual(params(template)('/users/123'), { id: '123' });
```

```ts
import assert from 'assert';
import { path } from 'bath/path';     // import `path()` only
import { params } from 'bath/params'; // import `params()` only

const template = '/users/{id}';
assert.deepEqual(path(template)({ id: '123' }), '/users/123');
assert.deepEqual(params(template)('/users/123'), { id: '123' });
```

## Types

```ts
// '/users/{userId}/messages/{messageId}'
export type PathTemplate = string;

// 'userId'
export type ParameterName = string;

// { 'userId': /^\w+$/, 'messageId': /^\d+$/ }
export type ParameterPatterns = { [parameterName: string]: RegExp; };

// { 'userId': 'john', 'messageId': '123' }
export type Parameters = { [parameterName: string]: string; };

// '/users/john/messages/123'
export type Path = string;

// assert.deepEqual(
//   params('/users/john/messages/123'),
//   { 'userId': 'john', 'messageId': '123' }
// );
export type ParametersFn = (path: Path) => Parameters | null;

// assert.deepEqual(
//   path({ 'userId': 'john', 'messageId': '123' }),
//   '/users/john/messages/123'
// );
export type PathFn = (params: Parameters) => Path | null;

// const { params, path } = bath('/users/{userId}/messages/{messageId}')
export type Bath = (
  template: PathTemplate,
  patterns?: ParameterPatterns
) => { path: PathFn, params: ParametersFn };
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
