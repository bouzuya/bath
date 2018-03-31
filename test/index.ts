import { Test, run, test } from 'beater';
import assert from 'power-assert';
import bathFn from '../src/';
import * as bath from '../src/';
import { tests as namesTests } from './names';
import { tests as paramsTests } from './params';
import { tests as pathTests } from './path';

const category = '/bath ';
const tests: Test[] = [
  test(category + 'bath.names', () => {
    const { names } = bath;
    assert.deepEqual(names('/users/{id}'), ['id']);
  }),

  test(category + 'bath.path', () => {
    const { path } = bath;
    assert.deepEqual(path('/users/{id}')({ id: '123' }), '/users/123');
  }),

  test(category + 'bath.params', () => {
    const { params } = bath;
    assert.deepEqual(params('/users/{id}')('/users/123'), { id: '123' });
  }),

  test(category + 'bath(...).names & bath(...).path & bath(...).params', () => {
    const data: Array<[
      string,
      { [k: string]: RegExp; } | undefined,
      string[],
      string | null,
      {} | null
    ]> = [
        ['/p', undefined, [], '/p', {}],
        ['/p', undefined, [], '/P', null],
        ['/p', undefined, [], '/p/', null],
        ['/p', undefined, [], '/p/%20', null],
        ['/p', undefined, [], '/p/123', null],
        ['/p', undefined, [], '/p/abc', null],
        ['/p', undefined, [], '/p/123/', null],
        ['/p/{x}', undefined, ['x'], '/p', null],
        ['/p/{x}', undefined, ['x'], null, {}],
        ['/p/{x}', undefined, ['x'], '/p/', { x: '' }],
        ['/p/{x}', undefined, ['x'], '/p/%20', { x: ' ' }],
        ['/p/{x}', undefined, ['x'], '/p/123', { x: '123' }],
        ['/p/{x}', undefined, ['x'], '/p/abc', { x: 'abc' }],
        ['/p/{x}', undefined, ['x'], '/p/123/', null],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], '/p', null],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], null, {}],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], '/p/', null],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], '/p/%20', null],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], null, { x: ' ' }],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], '/p/123', { x: '123' }],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], '/p/abc', null],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], null, { x: 'abc' }],
        ['/p/{x}', { x: /^\d+$/ }, ['x'], '/p/123/', null],
        ['/p/{x}/t/{y}', undefined, ['x', 'y'], '/p', null],
        ['/p/{x}/t/{y}', undefined, ['x', 'y'], '/p/a', null],
        ['/p/{x}/t/{y}', undefined, ['x', 'y'], '/p/a/t/', { x: 'a', y: '' }],
        ['/p/{x}/t/{y}', undefined, ['x', 'y'], '/p/a/t/1', { x: 'a', y: '1' }],
        ['/p/{x}/t/{y}', undefined, ['x', 'y'], '/p//t/', { x: '', y: '' }],
        ['/p/{x}/t/{y}', undefined, ['x', 'y'], '/p/a/t/1/', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, ['x', 'y'], '/p', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, ['x', 'y'], '/p/a', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, ['x', 'y'], '/p/a/t/', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, ['x', 'y'], '/p/a/t/1', { x: 'a', y: '1' }],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, ['x', 'y'], '/p//t/', null],
        ['/p/{x}/t/{y}', { x: /^\w$/, y: /^\d$/ }, ['x', 'y'], '/p/a/t/1/', null],
        ['/p/{x}/t/{x}', undefined, ['x'], '/p', null],
        ['/p/{x}/t/{x}', undefined, ['x'], '/p/a', null],
        ['/p/{x}/t/{x}', undefined, ['x'], '/p/a/t/a', { x: 'a' }],
        ['/p/{x}/t/{x}', undefined, ['x'], '/p/a/t/1', null],
        ['/p/{x}/t/{x}', undefined, ['x'], '/p//t/', { x: '' }],
        ['/p/{x}/t/{x}', undefined, ['x'], '/p/%20/t/%20', { x: ' ' }],
        // '/{x}{y}'
        ['/p/{x}', { x: /^ $/ }, ['x'], '/p/%20', { x: ' ' }],
        ['/p/{x}', { x: /^%20$/ }, ['x'], '/p/%20', null]
      ];
    data.forEach(([template, patterns, names, path, parameters]) => {
      const {
        names: actualNames,
        params: paramsFn,
        path: pathFn
      } = bathFn(template, patterns);
      assert.deepEqual(actualNames, names);
      if (path !== null) assert.deepEqual(paramsFn(path), parameters);
      if (parameters !== null) assert.deepEqual(pathFn(parameters), path);
    });
  })
].concat(namesTests).concat(paramsTests).concat(pathTests);

run(tests).catch(() => process.exit(1));
