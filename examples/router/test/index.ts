import * as assert from 'power-assert';
import beater from 'beater';
import { result, route, router } from '../src/';

const { test } = beater();

const category = 'router > ';

test(category + 'basic', () => {
  const router1 = router([
    route('root#index', '/'),
    route('users#index', '/users'),
    route('users#index', '/users/'),
    route('users#show', '/users/{id}', { id: /^\w+$/ }),
    route('users#show', '/users/{id}/', { id: /^\w+$/ })
  ], result('root#notfound', {}));

  assert.deepEqual(router1('/'), result('root#index', {}));
  assert.deepEqual(router1('/users'), result('users#index', {}));
  assert.deepEqual(router1('/users/'), result('users#index', {}));
  assert.deepEqual(router1('/users/123'), result('users#show', { id: '123' }));
  assert.deepEqual(router1('/users/123/'), result('users#show', { id: '123' }));
  assert.deepEqual(router1('/no-match'), result('root#notfound', {}));
});

test(category + 'handler', () => {
  type Params = { [name: string]: string; };
  type Handler = (params: Params) => void;

  const rootIndexHandler = (_: Params) => console.log('index');
  const rootNotFoundHandler = (_: Params) => console.log('not found')
  const userIndexHandler = (_: Params) => console.log(['bouzuya']);
  const userShowHandler = ({ id }: Params) => console.log(`user id: ${id}`);

  const handler1 = (name: string): Handler => {
    const handlers: { [name: string]: Handler; } = {
      'root#index': rootIndexHandler,
      'root#notfound': rootNotFoundHandler,
      'users#index': userIndexHandler,
      'users#show': userShowHandler
    };
    const h = handlers[name];
    return typeof h === 'undefined' ? rootNotFoundHandler : h;
  };

  const router1 = router([
    route('root#index', '/'),
    route('users#index', '/users'),
    route('users#index', '/users/'),
    route('users#show', '/users/{id}', { id: /^\w+$/ }),
    route('users#show', '/users/{id}/', { id: /^\w+$/ })
  ], result('root#notfound', {}));

  const routeHandler = (pathname: string): void => {
    const { name, params } = router1(pathname);
    return handler1(name)(params);
  };

  routeHandler('/'); // index
});
