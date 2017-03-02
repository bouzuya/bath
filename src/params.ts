import {
  pathTempalteToParameterNames
} from './_/path-template-to-parameter-names';
import {
  ParametersFn,
  ParameterPatterns,
  PathTemplate
} from './types';

type PathPattern = RegExp;

interface Pattern {
  pathPattern: PathPattern;
  parameters: ParameterPattern[];
}

interface ParameterPattern {
  name: string;
  pattern: RegExp | null;
}

const params = (
  template: PathTemplate,
  patterns?: ParameterPatterns
): ParametersFn => {
  const notFound = null;
  const { pathPattern, parameters } = inputToPattern(template, patterns);
  return (pathname) => {
    const m = pathname.match(pathPattern);
    if (m === null) return notFound;
    const parameterValues = m.slice(1);
    const npvs = parameterValues
      .map((value) => decodeURIComponent(value))
      .map((value, i) => {
        const { name, pattern } = parameters[i];
        return { name, pattern, value }; // npv
      });
    const hasUnmatchParameter = npvs.some(({ pattern, value }) => {
      return pattern !== null && value.match(pattern) === null;
    });
    if (hasUnmatchParameter) return notFound;
    const hasInvalidDuplicatedParameter = npvs.some(({ name, value }) => {
      return npvs.some(({ name: n, value: v }) => n === name && v !== value);
    });
    if (hasInvalidDuplicatedParameter) return notFound;
    return npvs
      .map(({ name, value }) => ({ [name]: value }))
      .reduce((a, x) => Object.assign(a, x), {});
  };
};

// '/users/{id}', { 'id': /^\d+$/ }
// -> { pathPattern: /^\/users\/([^\/]*)$/
//    , parameters: [{ name: 'id', pattern: /^\d+$/ }]
//    }
const inputToPattern = (
  template: PathTemplate,
  patterns: ParameterPatterns | undefined
): Pattern => {
  const userParameterPatterns = ensureUserParameterPatterns(patterns);
  const pathPattern = pathTemplateToPathPattern(template);
  const parameterNames = pathTempalteToParameterNames(template);
  const parameters = parameterNames.map((name) => {
    const userPattern = userParameterPatterns.find(({ name: n }) => n === name);
    const pattern = typeof userPattern === 'undefined'
      ? null
      : userPattern.pattern;
    return { name, pattern };
  });
  return { pathPattern, parameters };
};

const ensureUserParameterPatterns = (
  patterns: ParameterPatterns | undefined
): ParameterPattern[] => {
  if (typeof patterns === 'undefined') return [];
  return Object
    .keys(patterns)
    .map((name) => {
      const patternOrUndefined = patterns[name];
      const pattern = typeof patternOrUndefined === 'undefined'
        ? null
        : patternOrUndefined;
      return { name, pattern };
    });
};

// '/users/{id}' -> /^\/users\/[^\/]*$/
const pathTemplateToPathPattern = (template: PathTemplate): PathPattern => {
  return new RegExp(
    '^' + template.replace(/\{[A-Za-z0-9_]+\}/g, '([^\\/]*)') + '$'
  );
};

export { params };
