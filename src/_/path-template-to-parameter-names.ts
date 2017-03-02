// '/users/{id}' -> ['id']
const pathTempalteToParameterNames = (template: string): string[] => {
  const nameMatcher = template.match(/\{[A-Za-z0-9_]+\}/g);
  return nameMatcher === null
    ? []
    : nameMatcher.map((x) => x.substring(1, x.length - 1));
};

export { pathTempalteToParameterNames };
