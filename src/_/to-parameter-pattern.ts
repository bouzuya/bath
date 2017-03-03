import {
  pathTempalteToParameterNames
} from './path-template-to-parameter-names';
import {
  ParameterPattern,
  PathTemplate,
  ParameterPatterns
} from './types';

// '/users/{id}', { 'id': /^\d+$/ }
// -> parameters: [{ name: 'id', pattern: /^\d+$/ }]
const toParameterPattern = (
  template: PathTemplate,
  patterns: ParameterPatterns | undefined
): ParameterPattern => {
  const userParameterPatterns = typeof patterns === 'undefined'
    ? []
    : Object
      .keys(patterns)
      .map((name) => {
        const patternOrUndefined = patterns[name];
        const pattern = typeof patternOrUndefined === 'undefined'
          ? null
          : patternOrUndefined;
        return { name, pattern };
      });
  const parameterNames = pathTempalteToParameterNames(template);
  const parameters = parameterNames.map((name) => {
    const userPattern = userParameterPatterns.find(({ name: n }) => n === name);
    const pattern = typeof userPattern === 'undefined'
      ? null
      : userPattern.pattern;
    return { name, pattern };
  });
  return parameters;
};

export { toParameterPattern };
