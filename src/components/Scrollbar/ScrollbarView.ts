import { View } from '@/components/core';
import { find$, on } from '@/utils/dom';

const THUMB_ACTIVE = 'hui-scrollthumb-active';

export default class ScrollbarView extends View {
  get $thumb() {
    return find$('.hui-scrollthumb', this.$target) as HTMLDivElement;
  }

  bindEvents(): void {
    this.handleScrollThumbActive();
  }

  /**
   * Handle scroll thumb active state
   * @private
   */
  private handleScrollThumbActive() {
    let isActive = false;
    const $html = find$('html') as HTMLElement;
    on(this.$thumb, 'mousedown', () => {
      (isActive = true), this.$thumb.classList.add(THUMB_ACTIVE);
    });
    on($html, 'mouseup', () => {
      if (isActive) this.$thumb.classList.remove(THUMB_ACTIVE), (isActive = false);
    });
  }

  template(): string {
    return /*html*/ `
      <div class="hui-scrollthumb">
        <div class="hui-scrollthumb-content"></div>
      </div>
    `;
  }
}
