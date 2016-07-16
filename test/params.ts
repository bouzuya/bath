import * as assert from 'power-assert';
import beater from 'beater';
import { params } from '../src/';

const { test } = beater();

test('params > match', () => {
  assert.deepEqual(params('/users/:id')('/users/123'), { id: '123' });
});

test('params > not match', () => {
  assert.deepEqual(params('/users')('/users/123'), undefined);
});
