import {
  pathTempalteToParameterNames
} from './_/path-template-to-parameter-names';
import { toParameterPattern } from './_/to-parameter-pattern';
import { ParameterPatterns, PathFn, PathTemplate } from './_/types';

const path = (
  template: PathTemplate,
  patterns?: ParameterPatterns
): PathFn => {
  const parameterNames = pathTempalteToParameterNames(template);
  return (params) => {
    if (parameterNames.some((name) => typeof params[name] !== 'string')) {
      return null;
    }
    const parameterPattern = toParameterPattern(template, patterns);
    if (parameterPattern.some(({ name, pattern }) => {
      return pattern !== null && params[name].match(pattern) === null;
    })) {
      return null;
    }
    return parameterNames
      .reduce((a, name) => {
        return a
          .split('{' + name + '}')
          .join(encodeURIComponent(params[name]));
      }, template);
  };
};

export { path };
