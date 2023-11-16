import { isString } from '@/utils/common';
import { isEqual } from 'lodash-es';
import BodyView from './BodyView';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { Observable } from '@t/observable';
import { cn } from '@/healpers/className';
import { aria$, createNode } from '@/utils/dom';
import { RowElement, RowView } from '../Row';
import { SourceData } from '@t/instance/source';

export interface BodyState extends DefaultState {
  nodata: Observable<string | Element | undefined>;
}

export default class BodyElement extends Component<BodyView, BodyState> {
  renderMap: Map<number, { element: HTMLTableRowElement; row?: RowElement }>;

  constructor(view: BodyView, state: BodyState) {
    super(view, state);
    this.renderMap = new Map();
  }

  init(): void {
    this._syncNodata();
    this._syncOffsetsAndData();
    this._syncViewport();
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
    const {
      source,
      rowCoords: { offsets },
    } = this.state.instance;
    let prevOffset = [0, 0];

    source.store.subscribe((cur, prev) => {
      if (isEqual(cur, prev)) return;
      this.renderDatas(cur, offsets());
    }, true);

    offsets.subscribe((cur) => {
      if (isEqual(cur, prevOffset)) return;
      prevOffset = cur;
      const items = source.items();
      this._syncSpace(items.length, cur);
      this.renderDatas(items, cur);
    });
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

  /**
   * Sync virtual top & bottom space height
   * @param {number} dataSize
   * @param {[number, number]} offset
   */
  private _syncSpace(dataSize: number, offset: number[]) {
    const $tbody = this.view.$target.querySelector(cn('.', 'table', ' tbody'));
    if (!$tbody) return;
    const $thead = $tbody.previousElementSibling as HTMLElement;
    const $tfoot = $tbody.nextElementSibling as HTMLElement;
    const [startIndex, endIndex] = offset;

    const rowHeight = this.state.instance.demension().rowHeight;
    const virtualTopHeight = Math.max(startIndex * rowHeight, 0);
    const virtualBottomHeight = Math.max((dataSize - endIndex) * rowHeight, 0);

    if (virtualTopHeight === 0) $thead.innerHTML = '';
    else $thead.innerHTML = `<tr role="row" style="height:${virtualTopHeight}px"><td></td></tr>`;
    if (virtualBottomHeight === 0) $tfoot.innerHTML = '';
    else $tfoot.innerHTML = `<tr role="row" style="height:${virtualBottomHeight}px"><td></td></tr>`;
  }

  renderDatas(datas: SourceData[], offset: number[]) {
    const dataSize = datas.length;
    this.view[dataSize ? 'hide' : 'show'](cn('.', 'nodata'));

    const $tbody = this.view.$target.querySelector(cn('.', 'table', ' tbody'));
    if (!$tbody) return;

    if (!this.renderMap) this.renderMap = new Map();
    const renderMap = this.renderMap;
    const [startIndex, endIndex] = offset;

    datas.forEach((data, index) => {
      const rowindex = index + 1;
      const item = renderMap.get(rowindex);
      if (startIndex < rowindex && index < endIndex) {
        if (!item?.element) {
          const $tr = createNode('tr', { role: 'row', ariaAttr: { rowindex }, style: { height: '32px' } });
          $tr.innerHTML = `<td>Row ${rowindex}</td>`;
          const $after = $tbody.querySelector(`[aria-rowindex="${rowindex + 1}"`);
          if ($after) $tbody.insertBefore($tr, $after);
          else {
            const nextItem = (Array.from($tbody.childNodes) as HTMLElement[]).find(
              ($el) => rowindex < Number($el.ariaRowIndex)
            );
            $tbody.insertBefore($tr, nextItem ?? null);
          }
          renderMap.set(rowindex, { element: $tr });
        }
      } else {
        if (item?.element) item.element.remove();
        renderMap.delete(rowindex);
      }
    });
  }
}
