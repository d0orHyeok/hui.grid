import { DataObject } from '@t/index';
import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';
import { Column } from './column';

export interface SourceParams {
  opts: Observable<OptGrid>;
  column: Column;
}

export type SourceData = {
  type: 'data';
  key: string;
  data: DataObject;
};

export type GroupSourceData = {
  type: 'group';
  keys: any[];
  groupIndex: number;
  groupField: string;
  items: Array<GroupSourceData | SourceData>;
};

export interface Source {
  keyExpr: string;
  readonly mutation: Observable<SourceMutation>;
  readonly offsets: Observable<number[]>;
  readonly store: Observable<SourceData[]>;
  changes: () => SourceChange[];
  clear: () => void;
  insert: (...datas: DataObject[]) => void;
  items: () => SourceData[];
  remove: (key: string) => void;
  setData: (datas: DataObject[]) => void;
  update: (key: string, data: Partial<DataObject>) => void;
}

export type SourceChange<T extends DataObject = DataObject> =
  | { type: 'insert'; key: string; data: T }
  | { type: 'update'; key: string; data: Partial<T> }
  | { type: 'remove'; key: string };

export type SourceChangeType = SourceChange['type'];

export interface SourceMutation {
  [key: string]: SourceChange;
}
