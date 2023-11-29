import { Component } from '@/components/core';
import RowView from './RowView';
import { DefaultState } from '@t/components';
import { create$ } from '@/utils/dom';
import { ColumnElement, ColumnView } from '@/components/Column';
import { CellElement, CellView } from '../Cell';
import { SourceData, StoreDataItem, StoreGroupItem } from '@t/instance/source';
import { ExpanderElement, ExpanderView } from '../Expander';

export type RowType = 'header' | 'virtual' | 'group' | 'data';

export type RowState = DefaultState & (DataRowState | HeaderRowState | VirtualRowState);

export type DataRowState<Data extends SourceData = SourceData> = Data extends StoreGroupItem
  ? {
      type: 'group';
      data: StoreGroupItem;
    }
  : {
      type: 'data';
      data: StoreDataItem;
    };

export type HeaderRowState = {
  type: 'header';
  rowindex: number;
};

export type VirtualRowState = {
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
    this.renderGroupCells();
  }

  renderVirtualCells() {
    if (this.state.type !== 'virtual') return;
    const { height, instance } = this.state;
    const { length } = instance.column.visibleColumnInfos;
    const tds = Array.from({ length }, (_) => `<td style="height: ${height}px"></td>`).join('');
    this.view.$target.innerHTML = tds;
  }

  renderColumnHeaders() {
    const { type } = this.state;
    const { $target } = this.view;
    if (type !== 'header' || !$target) return;
    const { instance, rowindex } = this.state;
    const { column } = instance;
    const { headerRowCount, indexColumnHeaderInfoMap, groupColumnInfos } = column;
    instance.column.columnHeaderInfos;
    const visibleColumnHeaderInfos = indexColumnHeaderInfoMap[rowindex].filter(({ visible }) => visible);

    $target.innerHTML = '';

    if (rowindex === 1 && groupColumnInfos.length !== 0) {
      groupColumnInfos.forEach(({ groupIndex }) => {
        const $td = create$('td', {
          role: 'columnheader',
          className: 'hui-grid-expander',
          attr: { groupindex: groupIndex, rowspan: headerRowCount },
        });
        $target.appendChild($td);
      });
    }

    this.Columns = visibleColumnHeaderInfos.map((columnHeaderInfo) => {
      const { colindex } = columnHeaderInfo;
      const $td = create$('td', { role: 'columnheader', ariaAttr: { colindex } });
      $target.appendChild($td);
      return new ColumnElement(new ColumnView($td), { columnHeaderInfo, instance });
    });
  }

  renderDataCells() {
    const { instance, type } = this.state;
    const { $target } = this.view;
    if (type !== 'data' || !$target) return;
    const { data } = this.state;
    const { column } = instance;
    const { visibleColumnInfos, groupColumnInfos } = column;

    $target.innerHTML = '';

    groupColumnInfos.forEach(() => {
      const $td = create$('td', {
        role: 'columnheader',
        className: 'hui-grid-expander',
      });
      $target.appendChild($td);
    });

    this.Cells = visibleColumnInfos.map((columnInfo) => {
      const { colindex } = columnInfo;
      const $td = create$('td', { role: 'gridcell', ariaAttr: { colindex } });
      $target.appendChild($td);
      return new CellElement(new CellView($td), { type: 'data', columnInfo, instance, data });
    });
  }

  renderGroupCells() {
    const { instance, type } = this.state;
    const { $target } = this.view;
    if (type !== 'group' || !$target) return;
    const { data } = this.state;

    const { column } = instance;
    const { groupColumnInfos, visibleColumnInfos } = column;
    const groupColumnInfo = instance.column.groupColumnInfos[data.groupIndex];

    $target.innerHTML = '';

    const groupSize = groupColumnInfos.length;
    const colSize = visibleColumnInfos.length;
    groupColumnInfos.forEach((_, index) => {
      if (index <= data.groupIndex) {
        const $td = create$('td', {
          role: 'columnheader',
          className: 'hui-grid-expander',
        });
        $target.appendChild($td);
        if (index === data.groupIndex) new ExpanderElement(new ExpanderView($td), { instance, data });
      }
    });

    const $td = create$('td', { role: 'gridcell', attr: { colspan: groupSize + colSize - data.groupIndex } });
    $target.appendChild($td);
    const groupCell = new CellElement(new CellView($td), { type: 'group', groupColumnInfo, data, instance });
    this.Cells = [groupCell];
  }
}
