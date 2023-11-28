import { DataObject } from '@t/index';
import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';
import { Column } from './column';

export interface SourceParams {
  opts: Observable<OptGrid>;
  column: Column;
}

export type SourceData = StoreDataItem | StoreGroupItem;

export type StoreDataItem = {
  type: 'data';
  key: string;
  data: DataObject;
};

export type StoreGroupItem = {
  type: 'group';
  keys: any[];
  groupIndex: number;
  groupField: string;
  expanded: boolean;
  items: Array<SourceData>;
};

export type RenderStoreData = SourceData & {
  rowindex: number;
};

export interface Source {
  keyExpr: string;
  groupDataMap: DataObject<StoreDataItem[]>;
  readonly count: number;
  readonly mutation: Observable<SourceMutation>;
  readonly offsets: Observable<number[]>;
  readonly renderStore: Observable<RenderStoreData[]>;
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
