import { DataObject } from '@t/index';

export function compareRemove<T extends O, O extends Object>(data: T, compare: O) {
  const result: Partial<T> = { ...data };
  keys(compare, (key) => {
    if (compare[key] === data[key]) result[key] = undefined;
  });
  return result;
}

export function sum(numbers: number[]) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

export function hasProp<T extends Object, K extends keyof T>(object: T, key: string | K): key is K {
  return object.hasOwnProperty(key);
}

export function find<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => boolean) {
  return array.find(predicate);
}

export function findProp<T>(array: T[], key: keyof T, value: T[keyof T]) {
  return find(array, (item) => item[key] === value);
}

export function some<T>(array: T[], value: T[keyof T]) {
  return !!find(array, (v) => v === value);
}

export function someProp<T>(array: T[], key: keyof T, value: T[keyof T]) {
  return !!findProp(array, key, value);
}

export function findIndex<T>(array: T[], predicate: (value: T, index: number, arr: T[]) => boolean) {
  return array.findIndex(predicate);
}

export function findPropIndex<T>(array: T[], key: keyof T, value: T[keyof T]) {
  return findIndex(array, (item) => item[key] === value);
}

export function findIndexes<T>(array: T[], predicate: (value: T, index: number, arr: T[]) => boolean) {
  return array.reduce((acc, cur, idx) => (predicate(cur, idx, array) ? [...acc, idx] : acc), [] as number[]);
}

export function mapProp<T, K extends keyof T>(array: T[], key: K) {
  return array.map((item) => item[key]);
}

export function deleteArrayItem<T>(array: T[], predicate: (value: T, index: number, arr: T[]) => boolean) {
  const idx = array.findIndex(predicate);
  if (idx !== -1) array.splice(idx, 1);
  return array;
}

export function arrayToMap<T extends DataObject>(array: T[], key: keyof T) {
  const map: { [key: string]: T } = {};
  array.forEach((item) => (map[String(item[key])] = item));
  return map;
}

export function entries<T extends DataObject, K extends Extract<keyof T, string>, V extends T[K]>(
  object: T,
  callback: (key: K, value: V, index: number) => any
) {
  (Object.entries(object) as Array<[K, V]>).forEach(([key, value], index) => callback(key, value, index));
}

export function keys<T extends DataObject, K extends Extract<keyof T, string>>(
  object: T,
  callback: (key: K, index: number) => any
) {
  (Object.keys(object) as K[]).forEach((key, index) => callback(key, index));
}

export function values<T extends DataObject, V extends T[Extract<keyof T, string>]>(
  object: T,
  callback: (value: V, index: number) => any
) {
  (Object.values(object) as V[]).forEach((value, index) => callback(value, index));
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isNullish(value: unknown) {
  return isNull(value) || isUndefined(value);
}

export function isBlank(value: unknown) {
  if (isString(value)) return !value.length;
  return isNullish(value);
}

export function isObject(object: unknown) {
  return !isNull(object) && typeof object === 'object';
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isEmpty(object: any) {
  return isNullish(object) || (!isUndefined(object.length) && object.length === 0) || Object.keys(object).length === 0;
}

export function compareFunction(fn1: Function, fn2: Function) {
  return fn1.toString() === fn2.toString();
}

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
}
