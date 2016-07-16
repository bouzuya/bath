import * as assert from 'power-assert';
import beater from 'beater';
import bath from '../src/';

const { test } = beater();

test('bath > path', () => {
  const { path } = bath('/users/:id');
  assert(path({ id: '123' }) === '/users/123');
});

test('bath > params > match', () => {
  const { params } = bath('/users/:id');
  assert.deepEqual(params('/users/123'), { id: '123' });
});

test('bath > params > not match', () => {
  const { params } = bath('/users');
  assert.deepEqual(params('/users/123'), undefined);
});
