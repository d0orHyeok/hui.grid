import { View } from '@/components/core';
import { cn } from '@/healpers/className';
import { RowType } from './RowElement';

export default class RowView extends View {
  template(): string {
    return /*html*/ `
      <tr class="${cn('row')}"></tr>
    `;
  }

  setRowType(rowType: RowType) {
    this.$target.className = `${cn('row')} ${cn((rowType + 'Row') as any)}`;
  }
}
