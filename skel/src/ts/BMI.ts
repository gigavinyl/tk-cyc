/* tslint:disable:align */
import { combine, Stream } from 'most';
import { div, br, label, input, VNode } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/most-typings';
import { RouterSource } from 'cyclic-router/most-typings';

export type Sources = {
  DOM: DOMSource,
  router: RouterSource,
};
export type Sinks = {
  DOM: Stream<VNode>,
};

export default function BMI(sources: Sources): Sinks {
  const height$: Stream<number> = sources.DOM.select('#Height').events('input')
    .map(ev => parseInt((<HTMLInputElement>ev.target).value, 10))
    .startWith(177);
  const weight$: Stream<number> = sources.DOM.select('#Weight').events('input')
    .map(ev => parseInt((<HTMLInputElement>ev.target).value, 10))
    .startWith(62);

  const calcbmi = (h: number, w: number) => (w / (h / 100) ** 2).toFixed(1);
  const bmi$: Stream<string> = combine(calcbmi, height$, weight$);

  const vdom$ = combine((h: number, w: number, bmi: string) => {
    return div('.p2.measure', [
      label({ htmlFor: 'Height' }, 'Height: '),
      input('#Height', { value: h }),
      br(),
      label({ htmlFor: 'Weight' }, 'Weight: '),
      input('#Weight', { value: w }),
      br(),
      'BMI: ' + bmi,
    ]);
  }, height$, weight$, bmi$);

  return {
    DOM: vdom$,
  };
};
