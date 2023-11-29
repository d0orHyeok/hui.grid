import { isString } from '@/utils/common';
import { isEqual } from 'lodash-es';
import BodyView from './BodyView';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { Observable } from '@t/observable';
import { cn } from '@/healpers/className';
import { create$, find$ } from '@/utils/dom';
import { RowElement, RowState, RowView } from '../Row';
import { RenderStoreData, SourceData } from '@t/instance/source';

export interface BodyState extends DefaultState {
  nodata: Observable<string | Element | undefined>;
}

export default class BodyElement extends Component<BodyView, BodyState> {
  rowMap: Map<number, { element: HTMLTableRowElement; component?: RowElement }>;

  constructor(view: BodyView, state: BodyState) {
    super(view, state);
    this.rowMap = new Map();
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
      const $nodata = find$(cn('.', 'nodata'), this.view.$target);
      if (!state || !$nodata) return;
      if (isString(state)) $nodata.innerHTML = state;
      else ($nodata.innerHTML = ''), $nodata.appendChild(state);
    }, true);
  }

  private _syncOffsetsAndData() {
    const { source } = this.state.instance;
    const { renderStore, offsets } = source;
    let prevOffset = [0, 0];
    let prevItems: SourceData[] = [];

    renderStore.subscribe((items) => {
      if (!isEqual(prevItems, items)) {
        prevItems = items;
        this._cleanRows();
        const indexes = offsets();
        this._syncVirtualSpace(items.length, indexes);
        this._renderDatas(items, indexes);
      }
    });

    offsets.subscribe((cur) => {
      if (isEqual(cur, prevOffset)) return;
      const items = renderStore();
      const dataSize = items.length;
      prevOffset = cur;
      this._syncVirtualSpace(dataSize, cur);
      this._renderDatas(items, cur);
    });
  }

  private _syncViewport() {
    const {
      viewport,
      rowCoords: { coords },
    } = this.state.instance;
    const $container = find$(cn('.', 'scrollContainer'), this.view.$target);
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        viewport({ width, height });
        const isYScrollable = coords().scrollSize > height;
        if ($container) $container.classList[isYScrollable ? 'add' : 'remove'](cn('scrollable'));
      });
    });
    resizeObserver.observe(this.view.$target);
  }

  private _cleanRows() {
    this.rowMap.clear();
    const { $thead, $tbody, $tfoot } = this.view;
    [$thead, $tbody, $tfoot].forEach(($el) => ($el.innerHTML = ''));
  }

  /**
   * Sync virtual top & bottom space height
   * @param {number} dataSize
   * @param {[number, number]} offsets
   */
  private _syncVirtualSpace(dataSize: number, offsets: number[]) {
    const { $thead, $tfoot } = this.view;
    const [startIndex, endIndex] = offsets;

    const rowHeight = this.state.instance.demension().rowHeight;
    const virtualTopHeight = Math.max(startIndex * rowHeight, 0);
    const virtualBottomHeight = Math.max((dataSize - endIndex) * rowHeight, 0);

    const rowMap = this.rowMap;

    const createElem = ($target: HTMLElement, rowindex: number, height: number) => {
      if (height === 0) {
        rowMap.delete(rowindex);
        $target.innerHTML = '';
      } else {
        const item = rowMap.get(rowindex);
        if (item) item.element.querySelectorAll('td').forEach(($el) => ($el.style.height = height + 'px'));
        else {
          const $tr = create$('tr', { ariaAttr: { rowindex } });
          const Row = new RowElement(new RowView($tr), { instance: this.state.instance, height, type: 'virtual' });
          rowMap.set(rowindex, { element: $tr, component: Row });
          $target.appendChild($tr);
        }
      }
    };

    createElem($thead, 0, virtualTopHeight);
    createElem($tfoot, dataSize + 1, virtualBottomHeight);
  }

  private _renderDatas(datas: RenderStoreData[], offsets: number[]) {
    const { $tbody } = this.view;
    const dataSize = datas.length;
    this.view[dataSize ? 'hide' : 'show'](cn('.', 'nodata'));

    const instance = this.state.instance;

    const rowMap = this.rowMap;
    const [startIndex, endIndex] = offsets;

    datas.forEach((data, index) => {
      const rowindex = data.rowindex;
      const item = rowMap.get(rowindex);
      if (startIndex <= index && index < endIndex) {
        if (!item?.element) {
          const $tr = create$('tr', { ariaAttr: { rowindex }, style: { height: '32px' } });
          $tr.innerHTML = `<td>Row ${rowindex}</td>`;
          const $after = find$(`[aria-rowindex="${rowindex + 1}"`, $tbody);
          if ($after) $tbody.insertBefore($tr, $after);
          else {
            const nextItem = (Array.from($tbody.childNodes) as HTMLElement[]).find(
              ($el) => rowindex < Number($el.ariaRowIndex)
            );
            $tbody.insertBefore($tr, nextItem ?? null);
          }

          const state = { type: data.type, data, instance } as RowState;
          const Row = new RowElement(new RowView($tr), state);
          rowMap.set(rowindex, { element: $tr, component: Row });
        }
      } else {
        if (item?.element) item.element.remove();
        rowMap.delete(rowindex);
      }
    });
  }
}
