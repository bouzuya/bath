import * as assert from 'power-assert';
import { Test, run, test } from 'beater';
import bathFn from '../src/';
import * as bath from '../src/';
import { tests as namesTests } from './names';
import { tests as paramsTests } from './params';
import { tests as pathTests } from './path';

const category = '/bath ';
const tests: Test[] = [
  test(category + 'bath.path', () => {
    const { path } = bath;
    assert.deepEqual(path('/users/{id}')({ id: '123' }), '/users/123');
  }),

  test(category + 'bath.params', () => {
    const { params } = bath;
    assert.deepEqual(params('/users/{id}')('/users/123'), { id: '123' });
  }),

  test(category + 'bath(...).path & bath(...).params', () => {
    const data: [
      string,
      { [k: string]: RegExp; } | undefined,
      string | null,
      {} | null
    ][] = [
        ['/p', undefined, '/p', {}],
        ['/p', undefined, '/P', null],
        ['/p', undefined, '/p/', null],
        ['/p', undefined, '/p/%20', null],
        ['/p', undefined, '/p/123', null],
        ['/p', undefined, '/p/abc', null],
        ['/p', undefined, '/p/123/', null],
        ['/p/{x}', undefined, '/p', null],
        ['/p/{x}', undefined, null, {}],
        ['/p/{x}', undefined, '/p/', { x: '' }],
        ['/p/{x}', undefined, '/p/%20', { x: ' ' }],
        ['/p/{x}', undefined, '/p/123', { x: '123' }],
        ['/p/{x}', undefined, '/p/abc', { x: 'abc' }],
        ['/p/{x}', undefined, '/p/123/', null],
        ['/p/{x}', { x: /^\d+$/ }, '/p', null],
        ['/p/{x}', { x: /^\d+$/ }, null, {}],
        ['/p/{x}', { x: /^\d+$/ }, '/p/', null],
        ['/p/{x}', { x: /^\d+$/ }, '/p/%20', null],
        ['/p/{x}', { x: /^\d+$/ }, null, { x: ' ' }],
        ['/p/{x}', { x: /^\d+$/ }, '/p/123', { x: '123' }],
        ['/p/{x}', { x: /^\d+$/ }, '/p/abc', null],
        ['/p/{x}', { x: /^\d+$/ }, null, { x: 'abc' }],
        ['/p/{x}', { x: /^\d+$/ }, '/p/123/', null],
        ['/p/{x}/t/{y}', undefined, '/p', null],
        ['/p/{x}/t/{y}', undefined, '/p/a', null],
        ['/p/{x}/t/{y}', undefined, '/p/a/t/', { x: 'a', y: '' }],
        ['/p/{x}/t/{y}', undefined, '/p/a/t/1', { x: 'a', y: '1' }],
        ['/p/{x}/t/{y}', undefined, '/p//t/', { x: '', y: '' }],
        ['/p/{x}/t/{y}', undefined, '/p/a/t/1/', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, '/p', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, '/p/a', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, '/p/a/t/', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, '/p/a/t/1', { x: 'a', y: '1' }],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, '/p//t/', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, '/p/a/t/1/', null],
        ['/p/{x}/t/{x}', undefined, '/p', null],
        ['/p/{x}/t/{x}', undefined, '/p/a', null],
        ['/p/{x}/t/{x}', undefined, '/p/a/t/a', { x: 'a' }],
        ['/p/{x}/t/{x}', undefined, '/p/a/t/1', null],
        ['/p/{x}/t/{x}', undefined, '/p//t/', { x: '' }],
        ['/p/{x}/t/{x}', undefined, '/p/%20/t/%20', { x: ' ' }],
        // '/{x}{y}'
        ['/p/{x}', { x: /^ $/ }, '/p/%20', { x: ' ' }],
        ['/p/{x}', { x: /^%20$/ }, '/p/%20', null]
      ];
    data.forEach(([template, patterns, path, parameters]) => {
      const { params: paramsFn, path: pathFn } = bathFn(template, patterns);
      if (path !== null) assert.deepEqual(paramsFn(path), parameters);
      if (parameters !== null) assert.deepEqual(pathFn(parameters), path);
    });
  })
].concat(namesTests).concat(paramsTests).concat(pathTests);

run(tests).catch(() => process.exit(1));
