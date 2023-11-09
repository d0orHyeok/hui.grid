import { Component } from '@/components/core';
import RowView from './RowView';
import { DefaultState } from '@t/components';

export type RowType = 'header' | 'data' | 'group' | 'empty';

export interface RowState extends DefaultState {
  type: RowType;
}

export default class RowElement extends Component<RowView, RowState> {
  init(): void {
    this.view.setRowType(this.state.type);
  }
}
