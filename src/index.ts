import { params as paramsFn } from './params';
import { path as pathFn } from './path';
import { Bath } from './types';

const bath: Bath = (template, patterns?) => {
  const path = pathFn(template, patterns);
  const params = paramsFn(template, patterns);
  return { path, params };
};

export default bath;
export { bath, pathFn as path, paramsFn as params };
