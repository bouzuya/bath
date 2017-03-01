import * as assert from 'power-assert';
import beater from 'beater';
import { params } from '../src/params';

const { test } = beater();

const category = 'params > ';

test(category + 'returns function', () => {
  const p = params('/users');
  assert(typeof p === 'function');
});

test(category + 'template without parameters', () => {
  const p = params('/users');
  assert.deepEqual(p('/users'), {});
  assert.deepEqual(p('/users/'), undefined);
  assert.deepEqual(p('/users/123'), undefined);
  assert.deepEqual(p('/users/123/'), undefined);
  assert.deepEqual(p('/users/abc'), undefined);
  assert.deepEqual(p('/users/abc/'), undefined);
});

test(category + 'template with parameter', () => {
  const p = params('/users/{id}');
  assert.deepEqual(p('/users'), undefined);
  assert.deepEqual(p('/users/'), { id: '' });
  assert.deepEqual(p('/users/123'), { id: '123' });
  assert.deepEqual(p('/users/123/'), undefined);
  assert.deepEqual(p('/users/abc'), { id: 'abc' });
  assert.deepEqual(p('/users/abc/'), undefined);
});

test(category + 'template with strict parameter', () => {
  const p = params('/users/{id}', { id: /^\d+$/ });
  assert.deepEqual(p('/users'), undefined);
  assert.deepEqual(p('/users/'), undefined);
  assert.deepEqual(p('/users/123'), { id: '123' });
  assert.deepEqual(p('/users/123/'), undefined);
  assert.deepEqual(p('/users/abc'), undefined);
  assert.deepEqual(p('/users/abc/'), undefined);
});

test(category + 'template with parameters', () => {
  const p = params('/users/{userId}/posts/{id}');
  assert.deepEqual(p('/users'), undefined);
  assert.deepEqual(p('/users/'), undefined);
  assert.deepEqual(p('/users/a'), undefined);
  assert.deepEqual(p('/users/a/'), undefined);
  assert.deepEqual(p('/users/a/posts/'), { userId: 'a', id: '' });
  assert.deepEqual(p('/users/a/posts/1'), { userId: 'a', id: '1' });
  assert.deepEqual(p('/users//posts/'), { userId: '', id: '' });
});

test(category + 'template with strict parameters', () => {
  const p = params(
    '/users/{userId}/posts/{id}',
    { userId: /^\w+$/, id: /^\d+$/ }
  );
  assert.deepEqual(p('/users'), undefined);
  assert.deepEqual(p('/users/'), undefined);
  assert.deepEqual(p('/users/a'), undefined);
  assert.deepEqual(p('/users/a/'), undefined);
  assert.deepEqual(p('/users/a/posts/'), undefined);
  assert.deepEqual(p('/users/a/posts/1'), { userId: 'a', id: '1' });
});
