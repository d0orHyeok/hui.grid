import { View } from '@/components/core';

export default class ScrollbarView extends View {
  get $thumb() {
    return this.$target.querySelector('.hui-scrollthumb') as HTMLDivElement;
  }

  template(): string {
    return /*html*/ `
      <div class="hui-scrollthumb">
        <div class="hui-scrollthumb-content"></div>
      </div>
    `;
  }
}
