import { DataObject } from '@t/index';
import { Observable } from '@t/observable';

export type SourceParams = Observable<{
  keyExpr: string | undefined;
  datas: DataObject[] | undefined;
}>;

export interface SourceData {
  type: 'data' | 'group';
  key: string;
  data: DataObject;
  items?: DataObject[];
}

export interface Source {
  key: string;
  readonly changes: Observable<SourceChanges>;
  readonly offsets: Observable<number[]>;
  readonly store: Observable<SourceData[]>;
  clear: () => void;
  insert: (...datas: DataObject[]) => void;
  items: () => SourceData[];
  remove: (key: string) => void;
  setData: (datas: DataObject[]) => void;
  update: (key: string, data: Partial<DataObject>) => void;
}

export type SourceChangeItem<T extends DataObject = DataObject> =
  | { type: 'insert'; key: string; data: T }
  | { type: 'update'; key: string; data: Partial<T> }
  | { type: 'remove'; key: string };

export type SourceChangeType = SourceChangeItem['type'];

export interface SourceChanges {
  [key: string]: SourceChangeItem;
}
