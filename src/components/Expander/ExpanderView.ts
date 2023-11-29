import { View } from '@/components/core';
import { cn } from '@/healpers/className';

export default class ExpanderView extends View<HTMLTableCellElement> {
  template(): string {
    this.role('gridcell');
    this.$target.classList.add(cn('groupExpander'));
    return /*html*/ `<i class="hui-icon-row-expand"></i>`;
  }

  setIcon(isExpand: boolean) {
    this.$target.innerHTML = `<i class="hui-icon-row-${isExpand ? 'expand' : 'collapse'}"></i>`;
  }
}
