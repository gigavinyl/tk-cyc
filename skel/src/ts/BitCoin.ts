/* tslint:disable:align */
import { just, combine, Stream } from 'most';
import { div, p, VNode } from '@cycle/dom';
import { RequestInput } from '@cycle/http';
// import { HTTPSource } from '@cycle/http/most-typings';

export type Sources = {
  HTTP: any,
  // HTTP: HTTPSource
};
export type Sinks = {
  DOM: Stream<VNode>,
  HTTP: Stream<RequestInput>,
};

export default function BitCoin(sources: Sources): Sinks {
  const request$ = just({
    category: 'coinrates',
    url: 'http://api.coindesk.com/v1/bpi/currentprice.json',
  });

  const response$ = sources.HTTP.select('coinrates').flatMap((res: any) => res.body);

  const time$: Stream<string> = response$.map((body: any) => body.time.updated);
  const usd$: Stream<string> = response$.map((body: any) => body.bpi.USD.rate);

  const vdom$ = combine((time: string, usd: string) => {
    return div('.p2.measure', [
      p(`As of ${time}, Bitcoin is trading at ${usd} USD.`),
    ]);
  }, time$, usd$);

  return {
    DOM: vdom$,
    HTTP: request$,
  };
};
