import { View } from '@/components/core';
import { cn } from '@/healpers/className';

export default class ExpanderView extends View<HTMLTableCellElement> {
  template(): string {
    this.role('gridcell');
    this.$target.classList.add(cn('groupExpander'));
    return /*html*/ `<i class="ri-arrow-down-s-line"></i>`;
  }

  setIcon(isExpand: boolean) {
    this.$target.innerHTML = `<i class="ri-arrow-${isExpand ? 'down' : 'up'}-s-line"></i>`;
  }
}
