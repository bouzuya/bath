import * as assert from 'power-assert';
import beater from 'beater';
import { params } from '../src/params';

const { test } = beater();

const category = 'params > ';

test(category + 'template without parameters', () => {
  const p = params('/users');
  assert.deepEqual(p('/users'), {});
  assert.deepEqual(p('/users/'), null);
  assert.deepEqual(p('/users/%20'), null);
  assert.deepEqual(p('/users/123'), null);
  assert.deepEqual(p('/users/abc'), null);
  assert.deepEqual(p('/users/123/'), null);
});

test(category + 'template with parameter', () => {
  const p = params('/users/{id}');
  assert.deepEqual(p('/users'), null);
  assert.deepEqual(p('/users/'), { id: '' });
  assert.deepEqual(p('/users/%20'), { id: ' ' });
  assert.deepEqual(p('/users/123'), { id: '123' });
  assert.deepEqual(p('/users/abc'), { id: 'abc' });
  assert.deepEqual(p('/users/123/'), null);
});

test(category + 'template with strict parameter', () => {
  const p = params('/users/{id}', { id: /^\d+$/ });
  assert.deepEqual(p('/users'), null);
  assert.deepEqual(p('/users/'), null);
  assert.deepEqual(p('/users/%20'), null);
  assert.deepEqual(p('/users/123'), { id: '123' });
  assert.deepEqual(p('/users/abc'), null);
  assert.deepEqual(p('/users/123/'), null);
});

test(category + 'template with parameters', () => {
  const p = params('/users/{userId}/posts/{id}');
  assert.deepEqual(p('/users'), null);
  assert.deepEqual(p('/users/a'), null);
  assert.deepEqual(p('/users/a/posts/'), { userId: 'a', id: '' });
  assert.deepEqual(p('/users/a/posts/1'), { userId: 'a', id: '1' });
  assert.deepEqual(p('/users//posts/'), { userId: '', id: '' });
  assert.deepEqual(p('/users/a/posts/1/'), null);
});

test(category + 'template with duplicated parameters', () => {
  const p = params('/users/{id}/posts/{id}');
  assert.deepEqual(p('/users'), null);
  assert.deepEqual(p('/users/a'), null);
  assert.deepEqual(p('/users/a/posts/a'), { id: 'a' });
  assert.deepEqual(p('/users/a/posts/b'), null);
  assert.deepEqual(p('/users//posts/'), { id: '' });
  assert.deepEqual(p('/users/%20/posts/%20'), { id: ' ' });
});

test(category + 'template with strict parameters', () => {
  const p = params(
    '/users/{userId}/posts/{id}',
    { userId: /^\w+$/, id: /^\d+$/ }
  );
  assert.deepEqual(p('/users'), null);
  assert.deepEqual(p('/users/'), null);
  assert.deepEqual(p('/users/a'), null);
  assert.deepEqual(p('/users/a/'), null);
  assert.deepEqual(p('/users/a/posts/'), null);
  assert.deepEqual(p('/users/a/posts/1'), { userId: 'a', id: '1' });
});

test(category + 'parameter pattern is passed the decoded value', () => {
  const p1 = params('/users/{id}', { id: /^ $/ } );
  assert.deepEqual(p1('/users/%20'), { id: ' ' });
  const p2 = params('/users/{id}', { id: /^%20$/ } );
  assert.deepEqual(p2('/users/%20'), null);
});
