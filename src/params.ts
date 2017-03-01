interface Pattern {
  pathPattern: RegExp;
  parameters: Parameter[];
}

interface Parameter {
  name: string;
  pattern: RegExp | null;
}

const params = (
  template: string,
  params?: { [name: string]: RegExp; }
): (pathname: string) => { [name: string]: string; } | undefined => {
  const notFound = void 0;
  const { pathPattern, parameters } = inputToPattern(template, params);
  return (pathname: string): { [name: string]: string; } | undefined => {
    const m = pathname.match(pathPattern);
    if (m === null) return notFound;
    const parameterValues = m.slice(1);
    const results = parameterValues
      .map((value) => decodeURIComponent(value))
      .map((value, i) => {
        const { name, pattern } = parameters[i];
        return pattern === null || value.match(pattern) !== null
          ? { [name]: value }
          : notFound;
      })
      .filter((i) => i !== null)
      .reduce((a, x) => Object.assign(a, x), {});
    return parameterValues.length === Object.keys(results).length
      ? results
      : notFound;
  };
};

// '/users/{id}', { 'id': /^\d+$/ }
// -> { pathPattern: /^\/users\/([^\/]*)$/
//    , parameters: [{ name: 'id', pattern: /^\d+$/ }]
//    }
const inputToPattern = (
  template: string,
  params: { [name: string]: RegExp; } | undefined
): Pattern => {
  const userParameterPatterns = ensureUserParameterPatterns(params);
  const pathPattern = pathTemplateToPathPattern(template);
  const parameterNames = pathTempalteToParameterNames(template);
  const parameters = parameterNames.map((name) => {
    const userPattern = userParameterPatterns.find(({ name: n }) => n === name);
    const pattern = typeof userPattern === 'undefined'
      ? null
      : userPattern.pattern;
    return { name, pattern };
  });
  return { pathPattern, parameters: parameters };
};

const ensureUserParameterPatterns = (
  params: { [name: string]: RegExp; } | undefined
): Parameter[] => {
  if (typeof params === 'undefined') return [];
  return Object
    .keys(params)
    .map((name) => {
      const patternOrUndefined = params[name];
      const pattern = typeof patternOrUndefined === 'undefined'
        ? null
        : patternOrUndefined;
      return { name, pattern };
    });
};

// '/users/{id}' -> ['id']
const pathTempalteToParameterNames = (template: string): string[] => {
  const nameMatcher = template.match(/\{[A-Za-z0-9_]+\}/g);
  return nameMatcher === null
    ? []
    : nameMatcher.map((x) => x.substring(1, x.length - 1));
};

// '/users/{id}' -> /^\/users\/[^\/]*$/
const pathTemplateToPathPattern = (template: string): RegExp => {
  return new RegExp(
    '^' + template.replace(/\{[A-Za-z0-9_]+\}/g, '([^\\/]*)') + '$'
  );
};

export { params };
