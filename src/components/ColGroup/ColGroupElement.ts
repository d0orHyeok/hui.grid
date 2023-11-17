import { DefaultState } from '@t/components';
import { Component } from '@/components/core';
import ColGroupView from './ColGroupView';
import { isEqual } from 'lodash-es';

export interface ColGroupState extends DefaultState {}

export default class ColGroupElement extends Component<ColGroupView, ColGroupState> {
  init(): void {
    this._syncCols();
  }

  private _syncCols() {
    const { columnCoords } = this.state.instance;
    const { coords } = columnCoords;
    let prevWidths: number[] = [];
    coords.subscribe(({ widths }) => {
      if (!isEqual(widths, prevWidths)) {
        this._renderCols(widths), (prevWidths = widths);
      }
    });
  }

  private _renderCols(widths: number[]) {
    const { $target } = this.view;
    if ($target.childElementCount !== widths.length) $target.innerHTML = widths.map(() => `<col/>`).join('');
    const $cols = $target.querySelectorAll<HTMLTableColElement>('col');
    widths.forEach((width, index) => {
      const $col = $cols.item(index);
      $col.style.width = width + 'px';
    });
  }
}
