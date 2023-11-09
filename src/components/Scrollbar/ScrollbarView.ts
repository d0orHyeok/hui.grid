import { cn } from '@/healpers/className';
import { View } from '@/components/core';
import { ScrollbarPosition } from './ScrollbarElement';

const positionList = ['vertical', 'horizontal'];

export default class ScrollbarView extends View {
  template(): string {
    return /*html*/ `
      <div class="hui-scroll">
        <div class="hui-scroll-content"></div>
      </div>
    `;
  }

  setPosition(position: ScrollbarPosition) {
    const $el = this.$target;
    if ($el)
      positionList.forEach((item) => $el.classList[item === position ? 'add' : 'remove'](`${cn('scrollbar')}-${item}`));
  }
}
