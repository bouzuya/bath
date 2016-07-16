import * as pathToRegexp from 'path-to-regexp';

type Path = string;
type PathFn = (params?: Params) => Path;
type Params = { [key: string]: string; };
type ParamsFn = (path: Path) => Params | undefined;
type Template = string;

const bath = (template: Template): { path: PathFn; params: ParamsFn; } => {
  const keys: pathToRegexp.Key[] = [];
  const regexp = pathToRegexp(template, keys);
  const compiled = pathToRegexp.compile(template);

  const path: PathFn = (params?: Params): Path => {
    return compiled(params);
  };

  const params: ParamsFn = (path: string): Params | undefined => {
    const match = regexp.exec(path);
    if (!match) return undefined;
    const parsed: { [name: string]: string; } = {};
    for (let i = 1; i < match.length; i++) {
      parsed[keys[i - 1].name] = match[i];
    }
    return parsed;
  };

  return { path, params };
};

const path = (template: Template): PathFn => {
  return bath(template).path;
};

const params = (template: Template): ParamsFn => {
  return bath(template).params;
};

export default bath;
export { bath, path, params };
