export interface ObservableConstructor {
  <T = any>(arg: T | (() => T)): Observable<T>;
  <T = any, P = any>(callback: (...args: P[]) => T, ...arg: P[]): Observable<T>;
}

export type ObservableUnSubcriber = () => void;

export type ObservableSubscribe<T> = (
  handler: (state: T, prevState: T) => void,
  immediate?: boolean
) => ObservableUnSubcriber;

export interface Observable<T> {
  (): T;
  (value: T): void;
  value: T;
  subscribe: ObservableSubscribe<T>;
  publish: () => void;
}
