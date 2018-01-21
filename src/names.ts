import {
  pathTempalteToParameterNames
} from './_/path-template-to-parameter-names';
import { ParameterPatterns, PathTemplate } from './_/types';

const names = (
  template: PathTemplate,
  _patterns?: ParameterPatterns
): string[] => {
  const ns = pathTempalteToParameterNames(template);
  // remove duplicated
  return ns.filter((i, index, array) => array.indexOf(i) === index);
};

export { names };
