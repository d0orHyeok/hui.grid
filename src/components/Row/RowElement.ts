import { Component } from '@/components/core';
import RowView from './RowView';
import { DefaultState } from '@t/components';
import { ColumnHeaderInfo, GroupColumnInfo } from '@t/instance/column';
import { aria$ } from '@/utils/dom';
import { ColumnElement, ColumnView } from '@/components/Column';
import { CellElement, CellView } from '../Cell';
import { DataObject } from '@t/index';

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
      data: DataObject;
    };

export default class RowElement extends Component<RowView, RowState> {
  Cells?: CellElement[];
  Columns?: ColumnElement[];

  init(): void {
    this.view.setRowType(this.state.type);
    // Set rowHeight
    this.view.style({ height: this.state.instance.demension.rowHeight + 'px' });
    // Render columns
    this.renderColumnHeaders();
    this.renderDataCells();
  }

  renderColumnHeaders() {
    const type = this.state.type;
    if (type !== 'header') return;
    const { $target } = this.view;
    if (!$target) return;
    const { instance, columnHeaderInfos } = this.state;
    const visibleColumnHeaderInfos = columnHeaderInfos.filter(({ visible }) => visible);

    $target.innerHTML = visibleColumnHeaderInfos.map(({ colindex }) => `<td ${aria$({ colindex })}></td>`).join('');
    this.Columns = visibleColumnHeaderInfos.map((columnHeaderInfo) => {
      const { colindex } = columnHeaderInfo;
      const Column = new ColumnElement(new ColumnView(`${this.view.selector} td[${aria$({ colindex })}]`), {
        columnHeaderInfo,
        instance,
      });
      return Column;
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
    $target.innerHTML = visibleColumnInfos.map(({ colindex }) => `<td ${aria$({ colindex })}></td>`).join('');
    this.Cells = visibleColumnInfos.map((columnInfo) => {
      const { colindex } = columnInfo;
      const Cell = new CellElement(new CellView(`${this.view.selector} td[${aria$({ colindex })}]`), {
        type: 'data',
        columnInfo,
        instance,
        data,
      });
      return Cell;
    });
  }
}
