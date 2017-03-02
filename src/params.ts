import {
  pathTempalteToParameterNames
} from './_/path-template-to-parameter-names';
import {
  ParameterPatterns,
  Parameters,
  ParametersFn,
  Path,
  PathTemplate
} from './types';

type PathPattern = RegExp;
type ParameterPattern = NP[];
type NP = { name: string; } & { pattern: RegExp | null; };
type V = { value: string; };
type NPV = NP & V;

const params = (
  template: PathTemplate,
  patterns?: ParameterPatterns
): ParametersFn => {
  const notFound = null;
  const pathPattern = toPathPattern(template);
  const parameterPattern = toParameterPattern(template, patterns);
  return (pathname) => {
    const vs = matchPathPattern(pathname, pathPattern);
    if (vs === null) return notFound;
    const npvs = matchParameterPattern(vs, parameterPattern);
    if (npvs === null) return notFound;
    return toParameters(npvs);
  };
};

const toParameters = (npvs: NPV[]): Parameters => {
  return npvs
    .map(({ name, value }) => ({ [name]: value }))
    .reduce((a, x) => Object.assign(a, x), {});
};

const matchParameterPattern = (
  parameterValues: V[],
  parameterPattern: ParameterPattern
): NPV[] | null => {
  const npvs = parameterValues
    .map(({ value }) => decodeURIComponent(value))
    .map((value, i) => {
      const { name, pattern } = parameterPattern[i];
      return { name, pattern, value };
    });
  const hasUnmatchParameter = npvs.some(({ pattern, value }) => {
    return pattern !== null && value.match(pattern) === null;
  });
  if (hasUnmatchParameter) return null;
  const hasInvalidDuplicatedParameter = npvs.some(({ name, value }) => {
    return npvs.some(({ name: n, value: v }) => n === name && v !== value);
  });
  if (hasInvalidDuplicatedParameter) return null;
  return npvs;
};

const matchPathPattern = (
  pathname: Path,
  pathPattern: PathPattern
): V[] | null => {
  const m = pathname.match(pathPattern);
  if (m === null) return null;
  const vs = m.slice(1).map((value) => ({ value }));
  return vs;
};

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

// '/users/{id}' -> /^\/users\/[^\/]*$/
const toPathPattern = (template: PathTemplate): PathPattern => {
  return new RegExp(
    '^' + template.replace(/\{[A-Za-z0-9_]+\}/g, '([^\\/]*)') + '$'
  );
};

export { params };
