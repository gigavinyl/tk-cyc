/* global CLIENT */
declare var require: any;
declare var CLIENT: any;
declare var module: any;

// import { run } from '@cycle/most-run';
// import { makeDOMDriver, makeHTMLDriver } from '@cycle/dom';
//
// const { rerunner, restartable } = require('cycle-restart');
//
// let main = require('./main').default;
//
// export default () => {
//   run(main, {
//     DOM: makeHTMLDriver(null),
//   });
//
//   if (CLIENT) {
//     const drivers = {
//       DOM: restartable(makeDOMDriver('#root'), { pauseSinksWhileReplaying: false }),
//     };
//
//     const rerun = rerunner(run);
//     rerun(main, drivers);
//
//     if (module.hot) {
//       require('webpack-hot-middleware/client');
//       module.hot.accept(() => {
//         main = require('./main').default;
//         rerun(main, drivers);
//       });
//     }
//   }
// };
import { run } from '@cycle/most-run';
import { makeDOMDriver } from '@cycle/dom';
import { makeRouterDriver } from 'cyclic-router';
import Main from './Main';

const createHistory: any = require('history/createHistory');
const switchPath: any = require('switch-path');

const drivers: any = {
  DOM: makeDOMDriver('#root'),
  router: makeRouterDriver(createHistory(), switchPath),
};

run(Main, drivers);
