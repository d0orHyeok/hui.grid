import { Component } from '@/components/core';
import RowView from './RowView';
import { DefaultState } from '@t/components';
import { ColumnHeaderInfo, GroupColumnInfo } from '@t/instance/column';
import { aria$ } from '@/utils/dom';
import { ColumnElement, ColumnView } from '@/components/Column';

export type RowType = 'header' | 'data' | 'group';

export type RowState = DefaultState &
  RowTypedState & {
    type: RowType;
  };

export type RowTypedState =
  | {
      type: 'header';
      columnHeaderInfos: ColumnHeaderInfo[];
    }
  | {
      type: 'group';
      groupColumnInfo: GroupColumnInfo;
    };

export default class RowElement extends Component<RowView, RowState> {
  init(): void {
    this.view.setRowType(this.state.type);
    // Set rowHeight
    this.view.style({ height: this.state.instance.demension.rowHeight + 'px' });
    // Render columns
    this.renderColumnHeaders();
  }

  renderColumnHeaders() {
    const type = this.state.type;
    if (type !== 'header') return;
    const $render = this.view.$target;
    if (!$render) return;
    const { instance, columnHeaderInfos } = this.state;
    const visibleColumnHeaderInfos = columnHeaderInfos.filter(({ visible }) => visible);

    $render.innerHTML = visibleColumnHeaderInfos.map(({ colindex }) => `<td ${aria$({ colindex })}></td>`).join('');
    visibleColumnHeaderInfos.map((columnHeaderInfo) => {
      const { colindex } = columnHeaderInfo;
      const Column = new ColumnElement(new ColumnView(`${this.view.selector} td[${aria$({ colindex })}]`), {
        columnHeaderInfo,
        instance,
      });
      return Column;
    });
  }
}
