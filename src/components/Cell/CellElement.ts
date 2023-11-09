import { Component } from '@/components/core';
import CellView from './CellView';
import { DefaultState } from '@t/components';
import { ColumnInfo, GroupColumnInfo } from '@t/instance/column';

export type CellType = 'data' | 'group';

export type CellState = DefaultState &
  CellTypedState & {
    type: CellType;
  };

export type CellTypedState =
  | {
      type: 'data';
      columnInfo: ColumnInfo;
    }
  | {
      type: 'group';
      groupColumnInfo: GroupColumnInfo;
    };

export default class CellElement extends Component<CellView, CellState> {
  init(): void {}
}
