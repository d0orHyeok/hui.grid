import { DefaultState } from '@t/components';
import { Component } from '../core';
import ColumnView from './ColumnView';
import { ColumnHeaderInfo } from '@t/instance/column';
import { isFunction, isString } from '@/utils/common';
import { find$, on } from '@/utils/dom';
import { cn } from '@/healpers/className';
import { Evt } from '@t/html';

export interface ColumnState extends DefaultState {
  columnHeaderInfo: ColumnHeaderInfo;
}

export default class ColumnElement extends Component<ColumnView, ColumnState> {
  init() {
    this.renderColumn();
    this.makeResizable();
  }

  renderColumn() {
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

  makeResizable() {
    const { instance, columnHeaderInfo } = this.state;
    const { allowResizing, dataField } = columnHeaderInfo;
    const { column, columnCoords } = instance;
    const { commonOptions: commonColumnOpt, visibleColumnInfos, groupColumnInfos } = column;
    const { coords, customWidths } = columnCoords;

    // Check is resizable
    const $resizer = find$(cn('.', 'resizer'), this.view.$target) as HTMLElement;
    if (Array.isArray(columnHeaderInfo.columns)) return $resizer.classList.add('disabled');

    // Sync Resizing
    let prevColumnResizing: boolean | null = null;
    commonColumnOpt.subscribe(({ allowColumnResizing }) => {
      if (prevColumnResizing !== allowColumnResizing) {
        prevColumnResizing = allowColumnResizing;
        const isResizable = allowColumnResizing ?? allowResizing ?? true;
        $resizer.classList[isResizable ? 'remove' : 'add']('disabled');
      }
    });

    // Make resizable
    const groupColSize = groupColumnInfos.length;
    const columnInfoIndex = visibleColumnInfos.findIndex((item) => item.dataField === dataField);
    const isLast = visibleColumnInfos.at(-1)?.dataField === dataField;
    if (isLast) $resizer.style.marginRight = '2px';

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
}
