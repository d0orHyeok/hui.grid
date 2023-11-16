import { find$ } from '@/utils/dom';
import { View } from '../core';

export default class ColumnView extends View<HTMLTableCellElement> {
  template(): string {
    return /*html*/ `
      <div class="hui-grid-column-text"></div>
      <div class="hui-grid-column-indicators"></div>
      <div class="hui-grid-column-resizer"></div>
    `;
  }

  setSortIndicator(option: 'none' | 'asc' | 'desc') {
    const $el = find$('.hui-grid-column-indicators', this.$target);
    if (!$el) return;
    if (option === 'none') $el.innerHTML = '';
    else $el.innerHTML = `<span class="hui-icon-sort-${option === 'asc' ? 'up' : 'down'}"></span>`;
  }

  setCaption(template: any) {
    const $el = find$('.hui-grid-column-text', this.$target);
    if (!$el) return;
    $el.innerHTML = template;
  }
}
