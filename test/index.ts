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
  assert.deepEqual(params('/'), undefined);
  assert.deepEqual(params('/users'), {});
  assert.deepEqual(params('/users/'), {}); // strict: false
  assert.deepEqual(params('/users/123'), undefined);
  assert.deepEqual(params('/users/123/'), undefined);
  assert.deepEqual(params('/users/123/edit'), undefined);
  assert.deepEqual(params('/USERS'), {}); // sensitive: false
  assert.deepEqual(params('/USERS/'), {}); // strict: false && sensitive: false
  assert.deepEqual(params('/USERS/123'), undefined);
  assert.deepEqual(params('/USERS/123/'), undefined);
  assert.deepEqual(params('/USERS/123/edit'), undefined);
});

test('bath > params > `/users/:id`', () => {
  const { params } = bath('/users/:id');
  assert.deepEqual(params('/'), undefined);
  assert.deepEqual(params('/users'), undefined);
  assert.deepEqual(params('/users/'), undefined);
  assert.deepEqual(params('/users/123'), { id: '123' });
  assert.deepEqual(params('/users/123/'), { id: '123' }); // strict: false
  assert.deepEqual(params('/users/123/edit'), undefined);
  assert.deepEqual(params('/USERS'), undefined);
  assert.deepEqual(params('/USERS/'), undefined);
  assert.deepEqual(params('/USERS/123'), { id: '123' }); // sensitive: false
  // strict: false && sensitive: false
  assert.deepEqual(params('/USERS/123/'), { id: '123' });
  assert.deepEqual(params('/USERS/123/edit'), undefined);
});
