import { isFunction } from '@/utils/common';
import { Observable, ObservableUnSubcriber } from '@t/observable';
import { isEqual } from 'lodash-es';

type EffectDependencies<T> = [Observable<T>] | [Observable<T>, boolean];

const defaultCompare = <T>(state: T) => state;

function effect<T, V = T>(
  callback: (state: T, prevState: T) => any,
  [observable, immediate]: EffectDependencies<T>
): ObservableUnSubcriber;
function effect<T, V = T>(
  callback: (state: T, prevState: T) => any,
  [observable, immediate]: EffectDependencies<T>,
  defaults: T
): ObservableUnSubcriber;
function effect<T, V = T>(
  callback: (state: T, prevState: T) => any,
  [observable, immediate]: EffectDependencies<T>,
  compare: (state: T) => V,
  defaults?: V
): ObservableUnSubcriber;
function effect<T, V = T>(
  callback: (state: T, prevState: T) => any,
  [observable, immediate]: EffectDependencies<T>,
  ...options: any[]
): ObservableUnSubcriber {
  const [option1, option2] = options;

  let compare = defaultCompare;
  let defaults: T | V = compare(observable());

  if (isFunction(option1)) {
    compare = option1;
    if (options.length > 1) defaults = option2;
  } else if (options.length === 1) defaults = option1;

  let previousValue = defaults;
  return observable.subscribe((state, prevState) => {
    const currentValue = compare(state);
    if (isEqual(currentValue, previousValue)) return;
    previousValue = currentValue;
    callback(state, prevState);
  }, immediate);
}

export default effect;
