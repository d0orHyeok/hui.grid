import { Component } from '@/components/core';
import RowView from './RowView';
import { DefaultState } from '@t/components';
import { ColumnHeaderInfo, GroupColumnInfo } from '@t/instance/column';
import { create$ } from '@/utils/dom';
import { ColumnElement, ColumnView } from '@/components/Column';
import { CellElement, CellView } from '../Cell';
import { SourceData } from '@t/instance/source';

export type RowType = RowTypedState['type'];

export type RowState = DefaultState & RowTypedState;

export type RowTypedState =
  | {
      type: 'header';
      columnHeaderInfos: ColumnHeaderInfo[];
    }
  | {
      type: 'group';
      groupColumnInfo: GroupColumnInfo;
    }
  | {
      type: 'data';
      data: SourceData;
    }
  | {
      type: 'virtual';
      height: number;
    };

export default class RowElement extends Component<RowView, RowState> {
  Cells?: CellElement[];
  Columns?: ColumnElement[];

  init(): void {
    this.view.setRowType(this.state.type);
    // Set rowHeight
    if (this.state.type !== 'virtual') this.view.style({ height: this.state.instance.demension().rowHeight + 'px' });
    // Render columns
    this.renderColumnHeaders();
    this.renderDataCells();
    this.renderVirtualCells();
  }

  renderVirtualCells() {
    if (this.state.type !== 'virtual') return;
    const { height, instance } = this.state;
    const { length } = instance.column.visibleColumnInfos;
    const tds = Array.from({ length }, (_) => `<td style="height: ${height}px"></td>`).join('');
    this.view.$target.innerHTML = tds;
  }

  renderColumnHeaders() {
    const type = this.state.type;
    if (type !== 'header') return;
    const { $target } = this.view;
    if (!$target) return;
    const { instance, columnHeaderInfos } = this.state;
    const visibleColumnHeaderInfos = columnHeaderInfos.filter(({ visible }) => visible);

    $target.innerHTML = '';
    this.Columns = visibleColumnHeaderInfos.map((columnHeaderInfo) => {
      const { colindex } = columnHeaderInfo;
      const $td = create$('td', { role: 'columnheader', ariaAttr: { colindex } });
      $target.appendChild($td);
      return new ColumnElement(new ColumnView($td), { columnHeaderInfo, instance });
    });
  }

  renderDataCells() {
    const { instance, type } = this.state;
    if (type !== 'data') return;
    const { $target } = this.view;
    if (!$target) return;
    const { data } = this.state;
    const { column } = instance;
    const { visibleColumnInfos } = column;

    $target.innerHTML = '';
    this.Cells = visibleColumnInfos.map((columnInfo) => {
      const { colindex } = columnInfo;
      const $td = create$('td', { role: 'gridcell', ariaAttr: { colindex } });
      $target.appendChild($td);
      return new CellElement(new CellView($td), { type: 'data', columnInfo, instance, data });
    });
  }
}
