import { DefaultState } from '@t/components';
import { Component } from '../core';
import ColumnView from './ColumnView';
import { ColumnHeaderInfo } from '@t/instance/column';
import { isString } from '@/utils/common';

export interface ColumnState extends DefaultState {
  columnHeaderInfo: ColumnHeaderInfo;
}

export default class ColumnElement extends Component<ColumnView, ColumnState> {
  init() {
    this.renderColumn();
  }

  renderColumn() {
    const { $target } = this.view;
    this.view.role('columnheader');
    const { columnHeaderInfo } = this.state;
    const { colSpan, rowSpan, caption, className, headerCellTemplate } = columnHeaderInfo;
    if (isString(className)) $target.className = [$target.className, className].join(' ').trim();
    $target.tabIndex = -1;
    $target.colSpan = colSpan;
    $target.rowSpan = rowSpan;
    this.view.setCaption(caption);
  }
}
