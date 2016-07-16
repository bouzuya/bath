import * as assert from 'power-assert';
import beater from 'beater';
import { path } from '../src/';

const { test } = beater();

test('path', () => {
  assert(path('/users/:id')({ id: '123' }) === '/users/123');
});
