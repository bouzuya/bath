import {
  pathTempalteToParameterNames
} from './_/path-template-to-parameter-names';

const path = (
  template: string,
  _params?: { [name: string]: RegExp; }
): (parameters: { [name: string]: string; }) => string | null => {
  const parameterNames = pathTempalteToParameterNames(template);
  return (params: { [name: string]: string; }): string | null => {
    if (parameterNames.some((name) => typeof params[name] !== 'string')) {
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
