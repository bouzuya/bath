import { Test, test } from 'beater';
import * as assert from 'power-assert';
import { names } from '../src/names';

const category = '/names ';
const tests: Test[] = [
  test(category, () => {
    assert.deepEqual(names('/users'), []);
    assert.deepEqual(names('/users/{id}'), ['id']);
    assert.deepEqual(names('/users/{userId}/posts/{id}'), ['userId', 'id']);
    assert.deepEqual(names('/users/{id}/posts/{id}'), ['id']); // remove dups
    assert.deepEqual(names('/{x}{y}'), ['x', 'y']); // don't use this behavior
  })
];

export { tests };
