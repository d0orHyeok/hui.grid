import { View } from '@/components/core';
import { cn } from '@/healpers/className';
import { RowType } from './RowElement';
import { isString } from '@/utils/common';

export default class RowView extends View<HTMLTableRowElement> {
  template(): string {
    this.role('row');
    return /*html*/ ``;
  }

  get rowindex() {
    const rowindex = this.$target.ariaRowIndex;
    return isString(rowindex) ? Number(rowindex) : -1;
  }

  setRowType(rowType: RowType) {
    this.$target.className = `${cn('row')} ${cn((rowType + 'Row') as any)}`;
  }
}
