// Middlewares
// import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

// Router
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';

export const isDev = process.env.NODE_ENV === 'development';
export const history = createBrowserHistory();

export const middlewares = [thunk, createRouterMiddleware(history)];

/* eslint no-unused-expressions: 0 */
// isDev &&
//   middlewares.push(
//     createLogger({
//       duration: true,
//       collapsed: true,
//       colors: {
//         title: () => '#139BFE',
//         prevState: () => '#1C5FAF',
//         action: () => '#149945',
//         nextState: () => '#A47104',
//         error: () => '#ff0005',
//       },
//     })
//   );
