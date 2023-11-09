import HeaderView from './HeaderView';
import { cn } from '@/healpers/className';
import { RowElement, RowView } from '@/components/Row';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';

export interface HeaderState extends DefaultState {}

export default class HeaderElement extends Component<HeaderView, HeaderState> {
  Rows?: RowElement[];

  init(): void {
    this.renderContent();
  }

  renderContent() {
    const $render = this.$target.querySelector(cn('.', 'table', ' tbody'));
    if (!$render) return;
    const instance = this.state.instance;
    const arr = Array.from({ length: instance.column.headerRowCount }, (_, i) => i + 1);
    $render.innerHTML = arr.map((rowindex) => `<tr role="row" aria-rowindex="${rowindex}"></tr>`).join('');
    const type = 'header';
    const Rows = arr.map((rowindex) => {
      const Row = new RowElement(new RowView(`.${instance.root} tr[aria-rowindex="${rowindex}"]`), { type, instance });
      return Row;
    });
    this.Rows = Rows;
    return Rows;
  }
}
