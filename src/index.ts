import { names as namesFn } from './names';
import { params as paramsFn } from './params';
import { path as pathFn } from './path';
import { Bath } from './_/types';

const bath: Bath = (template, patterns?) => {
  const names = namesFn(template, patterns);
  const path = pathFn(template, patterns);
  const params = paramsFn(template, patterns);
  return { names, path, params };
};

export default bath;
export { bath, namesFn as names, pathFn as path, paramsFn as params };
