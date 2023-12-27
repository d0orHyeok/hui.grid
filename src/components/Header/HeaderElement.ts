import HeaderView from './HeaderView';
import { cn } from '@/healpers/className';
import { RowElement, RowView } from '@/components/Row';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { create$, find$, findAll$ } from '@/utils/dom';
import { effect } from '@/observable';
import { EditOption } from '@t/options';

export interface HeaderState extends DefaultState {}

export default class HeaderElement extends Component<HeaderView, HeaderState> {
  Rows?: RowElement[];

  init(): void {
    this._renderHeaderRows();
    this._syncEditColumn();
  }

  /**
   * @private
   */
  private _syncEditColumn() {
    const {
      root,
      edit: { options },
      column,
    } = this.state.instance;

    const comapre = (s: EditOption) => s.allowDeleting || s.allowUpdating;
    effect(
      (state) => {
        findAll$(`.${root} .${cn('editColumn')}`).forEach(($el) => $el.remove());
        const $row = this.view.$target.querySelector('tr[aria-rowindex="1"]');
        if (!$row || !comapre(state)) return;

        const $el = create$('td', {
          role: 'columnheader',
          className: cn('editColumn'),
          attr: { rowspan: column.headerRowCount },
        });
        $row.appendChild($el);
      },
      [options],
      (s) => s.allowDeleting || s.allowUpdating,
      false
    );
  }

  /**
   * @private
   */
  private _renderHeaderRows() {
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
