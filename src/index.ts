type Path = string;
type PathFn = (params?: Params) => Path;
type Params = { [key: string]: string; };
type ParamsFn = (path: Path) => Params | undefined;
type Template = string;

const bath = (template: Template): { path: PathFn; params: ParamsFn; } => {
  const path: PathFn = () => template;
  const params: ParamsFn = () => ({});
  return { path, params };
};

const path = (template: Template): PathFn => {
  return () => template;
};

const params = (template: Template): ParamsFn => {
  void template;
  return () => ({});
};

export default bath;
export { bath, path, params };
