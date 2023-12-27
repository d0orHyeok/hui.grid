import { DefaultState } from '@t/components';
import { Component } from '@/components/core';
import ColGroupView from './ColGroupView';
import { effect } from '@/observable';

export interface ColGroupState extends DefaultState {}

export default class ColGroupElement extends Component<ColGroupView, ColGroupState> {
  init(): void {
    this._syncCols();
  }

  /**
   * @private
   */
  private _syncCols() {
    const { columnCoords } = this.state.instance;
    const { coords } = columnCoords;

    effect(
      ({ widths }) => this._renderCols(widths),
      [coords],
      ({ widths }) => widths,
      []
    );
  }

  /**
   * @private
   * @param {number[]} widths
   */
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
