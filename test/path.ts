import { Test, test } from 'beater';
import assert from 'power-assert';
import { path } from '../src/path';

const category = '/path ';
const tests: Test[] = [
  test(category + 'template without parameters', () => {
    const p = path('/users');
    assert(p({}) === '/users');
  }),

  test(category + 'template with parameter', () => {
    const p = path('/users/{id}');
    assert(p({}) === null);
    assert(p({ id: '' }) === '/users/');
    assert(p({ id: ' ' }) === '/users/%20');
    assert(p({ id: '123' }) === '/users/123');
    assert(p({ id: 'abc' }) === '/users/abc');
  }),

  test(category + 'template with strict parameter', () => {
    const p = path('/users/{id}', { id: /^\d+$/ });
    assert(p({}) === null);
    assert(p({ id: '' }) === null);
    assert(p({ id: ' ' }) === null);
    assert(p({ id: '123' }) === '/users/123');
    assert(p({ id: 'abc' }) === null);
  }),

  test(category + 'template with duplicated parameters', () => {
    const p = path('/users/{id}/posts/{id}');
    assert(p({}) === null);
    assert(p({ id: 'a' }) === '/users/a/posts/a');
    assert(p({ id: '' }) === '/users//posts/');
    assert(p({ id: ' ' }) === '/users/%20/posts/%20');
  }),

  // don't use this behavior.
  test(category + 'no separator (`/`)', () => {
    const p1 = path('/{x}{y}');
    assert(p1({ x: '', y: '' }) === '/');
    assert(p1({ x: 'a', y: '' }) === '/a');
    assert(p1({ x: 'a', y: '1' }) === '/a1');
    assert(p1({ x: 'a1', y: '' }) === '/a1');
    assert(p1({ x: '', y: 'a1' }) === '/a1');
    const p2 = path('/{x}{y}', { x: /\w/, y: /\d/ });
    assert(p2({ x: '', y: '' }) === null);
    assert(p2({ x: '', y: '1' }) === null);
    assert(p2({ x: 'a', y: '' }) === null);
    assert(p2({ x: 'a', y: '1' }) === '/a1');
  }),

  test(category + 'parameter pattern is passed the dencoded value', () => {
    const p1 = path('/users/{id}', { id: /^ $/ });
    assert(p1({ id: ' ' }) === '/users/%20');
    const p2 = path('/users/{id}', { id: /^%20$/ });
    assert(p2({ id: ' ' }) === null);
  })
];

export { tests };
