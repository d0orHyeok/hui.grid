import { isString } from '@/utils/common';
import { isEqual } from 'lodash-es';
import BodyView from './BodyView';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { Observable } from '@t/observable';
import { cn } from '@/healpers/className';
import { create$, find$, findAll$ } from '@/utils/dom';
import { RowElement, RowState, RowView } from '../Row';
import { RenderStoreData } from '@t/instance/source';

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

    renderStore.subscribe((items) => {
      const indexes = offsets();
      this._syncVirtualSpace(items.length, indexes);
      this._renderDatas(items, indexes);
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

    const createVirtualSpaceElement = ($target: HTMLElement, rowindex: number, height: number) => {
      const $item = $target.firstElementChild;
      if (height === 0) return $item !== null && $item.remove();
      const $tr = create$('tr', { ariaAttr: { rowindex } });
      $target.replaceChildren($tr);
      new RowElement(new RowView($tr), { instance: this.state.instance, height, type: 'virtual' });
    };

    createVirtualSpaceElement($thead, 0, virtualTopHeight);
    createVirtualSpaceElement($tfoot, dataSize + 1, virtualBottomHeight);
  }

  private _renderDatas(datas: RenderStoreData[], offsets: number[]) {
    const { $tbody } = this.view;
    const dataSize = datas.length;
    this.view[dataSize ? 'hide' : 'show'](cn('.', 'nodata'));

    const instance = this.state.instance;

    const rowMap = this.rowMap;
    const [startIndex, endIndex] = offsets;
    const renderSet = new Set<number>();

    datas.slice(startIndex, endIndex).forEach((data) => {
      const { rowindex } = data;
      renderSet.add(rowindex);
      const item = rowMap.get(rowindex);
      const $exist = find$(`[aria-rowindex="${rowindex}"`, $tbody);
      if ($exist && item?.component?.type === data.type) return item.component.syncData(data);
      else if ($exist) $exist.remove();

      const $tr = create$('tr', { ariaAttr: { rowindex }, style: { height: '32px' } });
      const state = { type: data.type, data, instance } as RowState;

      const $after = find$(`[aria-rowindex="${rowindex + 1}"`, $tbody);
      if (!$after) {
        const nextItem = (Array.from(findAll$('.hui-grid-row', $tbody)) as HTMLElement[]).find(
          ($el) => rowindex < Number($el.ariaRowIndex)
        );
        $tbody.insertBefore($tr, nextItem ?? null);
      } else $tbody.insertBefore($tr, $after);

      const Row = new RowElement(new RowView($tr), state);
      rowMap.set(rowindex, { element: $tr, component: Row });
    });

    rowMap.forEach((item, rowindex) => {
      if (renderSet.has(rowindex)) return;
      if (item?.element) item.element.remove();
      rowMap.delete(rowindex);
    });
  }
}
