import { Bath } from './_/types';
import { names as namesFn } from './names';
import { params as paramsFn } from './params';
import { path as pathFn } from './path';

const bath: Bath = (template, patterns?) => {
  const names = namesFn(template);
  const path = pathFn(template, patterns);
  const params = paramsFn(template, patterns);
  return { names, path, params };
};

export default bath;
export { bath, namesFn as names, pathFn as path, paramsFn as params };
