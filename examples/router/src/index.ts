// add name and multi-route support
import { params as paramsFn } from 'bath/params';

// route pattern

export interface RoutePattern {
  name: string;
  fn: (path: string) => ({ [name: string]: string; } | null);
}

const route = (
  name: string,
  template: string,
  parameters?: { [name: string]: RegExp; }
): RoutePattern => {
  return { name, fn: paramsFn(template, parameters) };
};

// router

export type Router = (pathname: string) => RouteResult;

const router = (routes: RoutePattern[], defaultRoute: RouteResult): Router => {
  return (pathname: string): RouteResult => {
    for (const { name, fn } of routes) {
      const params = fn(pathname);
      if (params !== null) {
        return { name, params };
      }
    }
    return defaultRoute;
  };
};

// route result

export interface RouteResult {
  name: string;
  params: { [name: string]: string; };
};

const result = (
  name: string,
  params: { [name: string]: string; }
): RouteResult => {
  return { name, params };
};

export { result, route, router };
