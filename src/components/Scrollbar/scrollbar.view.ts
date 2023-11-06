import { cn } from '@/data/className';
import View from '@/mvc/View';
import { ScrollbarPosition } from './scrollbar.model';

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
