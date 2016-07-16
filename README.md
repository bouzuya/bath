# bath

A simple path template engine.

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
