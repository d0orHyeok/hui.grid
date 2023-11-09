import HeaderView from './HeaderView';
import { cn } from '@/healpers/className';
import { RowElement, RowView } from '@/components/Row';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { aria$ } from '@/utils/dom';

export interface HeaderState extends DefaultState {}

export default class HeaderElement extends Component<HeaderView, HeaderState> {
  Rows?: RowElement[];

  init(): void {
    this.renderHeaderRows();
  }

  renderHeaderRows() {
    const $render = this.view.$target.querySelector(cn('.', 'table', ' tbody'));
    if (!$render) return;
    const instance = this.state.instance;
    const { headerRowCount, indexColumnHeaderInfoMap } = instance.column;
    const arr = Array.from({ length: headerRowCount }, (_, i) => i + 1);
    $render.innerHTML = arr.map((rowindex) => `<tr role="row" ${aria$({ rowindex })}></tr>`).join('');
    const type = 'header';
    const Rows = arr.map((rowindex) => {
      const Row = new RowElement(new RowView(`.${instance.root} tr[${aria$({ rowindex })}]`), {
        type,
        instance,
        columnHeaderInfos: indexColumnHeaderInfoMap[rowindex],
      });
      return Row;
    });
    this.Rows = Rows;
  }
}
