import { isString } from '@/utils/common';
import { isEqual } from 'lodash-es';
import { DataObject } from '@t/index';
import BodyView from './BodyView';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { Observable } from '@t/observable';
import { cn } from '@/healpers/className';
import { aria$ } from '@/utils/dom';
import { RowElement, RowView } from '../Row';

export interface BodyState extends DefaultState {
  nodata: Observable<string | Element | undefined>;
}

export default class BodyElement extends Component<BodyView, BodyState> {
  Rows?: RowElement[];

  init(): void {
    this._syncNodata();
    this._syncData();
  }

  /**
   * Sync option nodata & body nodata
   */
  private _syncNodata() {
    const { nodata } = this.state;
    nodata.subscribe((state) => {
      const $nodata = this.view.$target.querySelector(cn('.', 'nodata'));
      if (!state || !$nodata) return;
      if (isString(state)) $nodata.innerHTML = state;
      else ($nodata.innerHTML = ''), $nodata.appendChild(state);
    }, true);
  }

  private _syncData() {
    const { source } = this.state.instance;
    source.store.subscribe((cur, prev) => {
      if (isEqual(cur, prev)) return;
      this.handleChangeDatas(cur);
    }, true);
  }

  handleChangeDatas(datas: DataObject[]) {
    const dataSize = datas.length;
    this.view[dataSize ? 'hide' : 'show'](cn('.', 'nodata'));

    const $tbody = this.view.$target.querySelector(cn('.', 'table', ' tbody'));
    if (!$tbody) return;
    $tbody.innerHTML = datas.map((_, index) => `<tr role="row" ${aria$({ rowindex: index + 1 })}></tr>`).join('');
    this.Rows = datas.map((data, index) => {
      const rowindex = index + 1;
      const Row = new RowElement(new RowView(`${this.view.selector} tr[${aria$({ rowindex })}]`), {
        type: 'data',
        data,
        instance: this.state.instance,
      });
      return Row;
    });
  }
}
