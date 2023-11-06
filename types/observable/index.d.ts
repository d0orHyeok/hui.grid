export interface ObservableConstructor {
  <T = any>(arg: T): Observable<T>;
  <T = any>(callback: (arg: T) => T, arg: T): Observable<T>;
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
