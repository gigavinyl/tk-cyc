import { just, Stream } from 'most';
import { div, br, i, button, h2, h4, VNode } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/most-typings';

export type Sources = {
  DOM: DOMSource,
};
export type Sinks = {
  DOM: Stream<VNode>,
};

export default function About(sources: Sources): Sinks {
  sources.DOM.select('.Hello').events('click').forEach(() => {
    console.log('Hello');
    alert('Hello!');
  });
  return {
    DOM: just(
      div('.p2.measure', [
        h2('About'),
        h4([
          i('tk-cyc'), ' is a Cycle.js boilerplate built with convenience and speed in mind.',
        ]),
        br(),
        button('.btn.Hello', 'Say Hello!'), ' ',
      ])
    ),
  };
};
