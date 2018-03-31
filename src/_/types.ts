// '/users/{userId}/messages/{messageId}'
export type PathTemplate = string;

// 'userId'
export type ParameterName = string;

// { 'userId': /^\w+$/, 'messageId': /^\d+$/ }
export interface ParameterPatterns { [parameterName: string]: RegExp; }

// { 'userId': 'john', 'messageId': '123' }
export interface Parameters { [parameterName: string]: string; }

// '/users/john/messages/123'
export type Path = string;

// assert.deepEqual(
//   params('/users/john/messages/123'),
//   { 'userId': 'john', 'messageId': '123' }
// );
export type ParametersFn = (path: Path) => Parameters | null;

// assert.deepEqual(
//   path({ 'userId': 'john', 'messageId': '123' }),
//   '/users/john/messages/123'
// );
export type PathFn = (params: Parameters) => Path | null;

// const { params, path } = bath('/users/{userId}/messages/{messageId}')
export type Bath = (
  template: PathTemplate,
  patterns?: ParameterPatterns
) => { names: ParameterName[]; path: PathFn; params: ParametersFn; };

// internal types

export type PathPattern = RegExp;
export type ParameterPattern = NP[];
export type NP = { name: string; } & { pattern: RegExp | null; };
export interface V { value: string; }
export type NPV = NP & V;
