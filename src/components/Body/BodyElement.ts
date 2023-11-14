import { isString } from '@/utils/common';
import { isEqual } from 'lodash-es';
import BodyView from './BodyView';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { Observable } from '@t/observable';
import { cn } from '@/healpers/className';
import { aria$ } from '@/utils/dom';
import { RowElement, RowView } from '../Row';
import { SourceData } from '@t/instance/source';

export interface BodyState extends DefaultState {
  nodata: Observable<string | Element | undefined>;
}

export default class BodyElement extends Component<BodyView, BodyState> {
  Rows?: RowElement[];

  init(): void {
    this._syncNodata();
    this._syncOffsetsAndData();
    this._syncViewport();
    this._bindVerticalScrollEvent();
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

  private _syncOffsetsAndData() {
    const { source } = this.state.instance;
    source.store.subscribe((cur, prev) => {
      if (isEqual(cur, prev)) return;
      this.renderDatas(cur);
    }, true);
  }

  private _syncViewport() {
    const { viewport } = this.state.instance;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        viewport({ width, height });
      });
    });
    resizeObserver.observe(this.view.$target);
  }

  private _bindVerticalScrollEvent() {
    const { rowCoords } = this.state.instance;
  }

  renderDatas(datas: SourceData[]) {
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
