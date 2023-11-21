import HeaderView from './HeaderView';
import { cn } from '@/healpers/className';
import { RowElement, RowView } from '@/components/Row';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { create$, find$ } from '@/utils/dom';

export interface HeaderState extends DefaultState {}

export default class HeaderElement extends Component<HeaderView, HeaderState> {
  Rows?: RowElement[];

  init(): void {
    this.renderHeaderRows();
  }

  renderHeaderRows() {
    const $render = find$(cn('.', 'table', ' tbody'), this.view.$target);
    if (!$render) return;
    const instance = this.state.instance;
    const { headerRowCount } = instance.column;
    const arr = Array.from({ length: headerRowCount }, (_, i) => i + 1);
    $render.innerHTML = '';
    this.Rows = arr.map((rowindex) => {
      const $tr = create$('tr', { role: 'row', ariaAttr: { rowindex } });
      $render.appendChild($tr);
      const Row = new RowElement(new RowView($tr), { type: 'header', instance, rowindex });
      return Row;
    });
  }
}
