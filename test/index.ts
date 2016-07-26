import * as assert from 'power-assert';
import beater from 'beater';
import bath from '../src/';

const { test } = beater();

test('bath > path', () => {
  const { path } = bath('/users/:id');
  assert(path({ id: '123' }) === '/users/123');
});

test('bath > params > `/users`', () => {
  const { params } = bath('/users');
  const data: [string, {} | undefined][] = [
    ['/', undefined],
    ['/users', {}],
    ['/users/', {}], // strict: false
    ['/users/123', undefined],
    ['/users/123/', undefined],
    ['/users/123/edit', undefined],
    ['/USERS', {}], // sensitive: false
    ['/USERS/', {}], // sensitive: false && strict: false
    ['/USERS/123', undefined],
    ['/USERS/123/', undefined],
    ['/USERS/123/edit', undefined]
  ];
  data.forEach(([path, result]) => {
    assert.deepEqual(params(path), result);
  });
});

test('bath > params > `/users/:id`', () => {
  const { params } = bath('/users/:id');
  const data: [string, {} | undefined][] = [
    ['/', undefined],
    ['/users', undefined],
    ['/users/', undefined], // strict: false
    ['/users/123', { id: '123' }],
    ['/users/123/', { id: '123' }],
    ['/users/123/edit', undefined],
    ['/USERS', undefined],
    ['/USERS/', undefined],
    ['/USERS/123', { id: '123' }], // sensitive: false
    ['/USERS/123/', { id: '123' }], // sensitive: false && strict: false
    ['/USERS/123/edit', undefined]
  ];
  data.forEach(([path, result]) => {
    assert.deepEqual(params(path), result);
  });
});
