import { View } from '@/components/core';

export default class ExpanderView extends View<HTMLTableCellElement> {
  template(): string {
    return /*html*/ `<i class="hui-icon-row-expand"></i>`;
  }

  setIcon(isExpand: boolean) {
    this.$target.innerHTML = `<i class="hui-icon-row-${isExpand ? 'expand' : 'collapse'}"></i>`;
  }
}
