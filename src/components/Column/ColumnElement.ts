import { DefaultState } from '@t/components';
import { Component } from '../core';
import ColumnView from './ColumnView';
import { ColumnHeaderInfo } from '@t/instance/column';
import { isFunction, isString } from '@/utils/common';
import { find$, on } from '@/utils/dom';
import { cn } from '@/healpers/className';
import { Evt } from '@t/html';
import { effect } from '@/observable';

export interface ColumnState extends DefaultState {
  columnHeaderInfo: ColumnHeaderInfo;
}

export default class ColumnElement extends Component<ColumnView, ColumnState> {
  init() {
    this._renderColumn();
    this._makeResizable();
    this._makeSortable();
  }

  /**
   * @private
   */
  private _renderColumn() {
    const { $target } = this.view;
    this.view.role('columnheader');
    const { columnHeaderInfo } = this.state;
    const { colSpan, rowSpan, caption, className, headerCellTemplate } = columnHeaderInfo;
    if (isString(className)) $target.className = [$target.className, className].join(' ').trim();
    $target.tabIndex = -1;
    $target.colSpan = colSpan;
    $target.rowSpan = rowSpan;

    const template = isFunction(headerCellTemplate) ? headerCellTemplate({ columnHeaderInfo }) : caption;
    this.view.setTemplate(template);
  }

  /**
   * @private
   */
  private _makeResizable() {
    const { instance, columnHeaderInfo } = this.state;
    const { allowResizing, dataField } = columnHeaderInfo;
    const { column, columnCoords } = instance;
    const { commonOptions: commonColumnOpt, visibleColumnInfos, groupColumnInfos } = column;
    const { coords, customWidths } = columnCoords;

    // Check is resizable
    const $resizer = find$(cn('.', 'resizer'), this.view.$target) as HTMLElement;
    if (Array.isArray(columnHeaderInfo.columns)) return $resizer.classList.add('disabled');

    // Sync Resizing
    effect(
      ({ allowColumnResizing }) => {
        const isResizable = allowColumnResizing ?? allowResizing ?? true;
        $resizer.classList[isResizable ? 'remove' : 'add']('disabled');
      },
      [commonColumnOpt],
      ({ allowColumnResizing }) => allowColumnResizing,
      null
    );

    // Make resizable
    const groupColSize = groupColumnInfos.length;
    const columnInfoIndex = visibleColumnInfos.findIndex((item) => item.dataField === dataField);

    const $grid = $resizer.closest('.hui-grid') as HTMLElement;
    const toggle = (bol: boolean) => $grid.classList[bol ? 'add' : 'remove']('hui-grid-resizing');

    let baseWidth = 0;
    let startX: null | number = null;

    const onMousedown = (event: Evt<HTMLElement, 'mousedown'>) => {
      (startX = event.pageX), (baseWidth = coords().widths[columnInfoIndex + groupColSize]);
      toggle(true);
    };
    const onMouseUp = () => ((startX = null), toggle(false));
    const onMouseMove = (event: Evt<HTMLElement, 'mousemove'>) => {
      if (startX === null) return;
      const moveX = event.pageX - startX;
      customWidths()[columnInfoIndex] = Math.max(32, baseWidth + moveX);
      customWidths.publish();
    };

    const $html = find$('html') as HTMLElement;
    on($resizer, 'mousedown', onMousedown);
    on($html, 'mouseup', onMouseUp);
    on($html, 'mousemove', onMouseMove);
  }

  /**
   * @private
   */
  private _makeSortable() {
    const { instance, columnHeaderInfo } = this.state;
    const { sorter } = instance.source;
    const { dataField, allowSorting } = columnHeaderInfo;

    if (!dataField) return;
    this.view.$target.dataset.sortable = `${allowSorting ?? true}`;
    if (allowSorting === false) return;

    const { $target } = this.view;
    const $resize = find$(cn('.', 'resizer'), $target) as HTMLElement;

    this.view.on('mousedown', (event) => {
      if ($resize && $resize.contains(event.target as Node)) return;
      const item = sorter.get(dataField);
      if (!item) sorter.insert({ field: dataField, sort: 'asc' });
      else if (item.sort === 'asc') sorter.update(dataField, 'desc');
      else sorter.remove(dataField);
    });

    sorter._sorts.subscribe((items) => {
      const { sort } = items.find((item) => item.field === dataField) ?? {};
      this.view.setSortIndicator(sort ?? 'none');
    });
  }
}
