export interface ObservableConstructor {
  <T = any>(arg: T | (() => T)): Observable<T>;
  <T = any, P = any>(callback: (...args: P[]) => T, ...arg: P[]): Observable<T>;
}

type UnSubcriber = () => void;

export type ObservableSubscribe<T> = (handler: (state: T, prevState: T) => void, immediate?: boolean) => UnSubcriber;

export interface Observable<T> {
  (): T;
  (value: T): void;
  value: T;
  subscribe: ObservableSubscribe<T>;
  publish: () => void;
}
