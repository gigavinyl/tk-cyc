import { just, Stream } from 'most';
import { div, h3, p, VNode } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/most-typings';
import { RouterSource } from 'cyclic-router/most-typings';

export type Sources = {
  DOM: DOMSource,
  router: RouterSource,
};
export type Sinks = {
  DOM: Stream<VNode>,
};

export default function NotFound(sources: Sources): Sinks {
  const vdom$ = just(div([
    h3('Page not found'),
    p('Please click on the links above to check the examples.'),
  ]));

  return {
    DOM: vdom$,
  };
}
