import {
  toParameterPattern
} from './_/to-parameter-pattern';
import {
  NPV,
  ParameterPattern,
  ParameterPatterns,
  Parameters,
  ParametersFn,
  Path,
  PathPattern,
  PathTemplate,
  V
} from './_/types';

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

// '/users/{id}' -> /^\/users\/[^\/]*$/
const toPathPattern = (template: PathTemplate): PathPattern => {
  return new RegExp(
    '^' + template.replace(/\{[A-Za-z0-9_]+\}/g, '([^\\/]*)') + '$'
  );
};

export { params };
