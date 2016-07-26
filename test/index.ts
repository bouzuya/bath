import * as assert from 'power-assert';
import beater from 'beater';
import bath from '../src/';

const { test } = beater();

test('bath > path', () => {
  const { path } = bath('/users/:id');
  assert(path({ id: '123' }) === '/users/123');
});

test('bath > params', () => {
  const data: [string, string, {} | undefined][] = [
    ['/users', '/', undefined],
    ['/users', '/users', {}],
    ['/users', '/users/', {}], // strict: false
    ['/users', '/users/123', undefined],
    ['/users', '/users/123 / ', undefined],
    ['/users', '/users/123 / edit', undefined],
    ['/users', '/USERS', {}], // sensitive: false
    ['/users', '/USERS/', {}], // sensitive: false && strict: false
    ['/users', '/USERS/123', undefined],
    ['/users', '/USERS/123 / ', undefined],
    ['/users', '/USERS/123 / edit', undefined],
    ['/users/:id', '/', undefined],
    ['/users/:id', '/users', undefined],
    ['/users/:id', '/users/', undefined], // strict: false
    ['/users/:id', '/users/123', { id: '123' }],
    ['/users/:id', '/users/123/', { id: '123' }],
    ['/users/:id', '/users/123/edit', undefined],
    ['/users/:id', '/USERS', undefined],
    ['/users/:id', '/USERS/', undefined],
    ['/users/:id', '/USERS/123', { id: '123' }], // sensitive: false
    // sensitive: false && strict: false
    ['/users/:id', '/USERS/123/', { id: '123' }],
    ['/users/:id', '/USERS/123/edit', undefined]
  ];
  data.forEach(([template, path, result]) => {
    const { params } = bath(template);
    assert.deepEqual(params(path), result);
  });
});
