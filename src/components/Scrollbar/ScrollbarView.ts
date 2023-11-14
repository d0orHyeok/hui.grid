import { View } from '@/components/core';
import { on } from '@/utils/dom';

const THUMB_ACTIVE = 'hui-scrollthumb-active';

export default class ScrollbarView extends View {
  get $thumb() {
    return this.$target.querySelector('.hui-scrollthumb') as HTMLDivElement;
  }

  bindEvents(): void {
    this.handleActive();
  }

  private handleActive() {
    let isActive = false;
    const $html = document.querySelector('html') as HTMLElement;
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
