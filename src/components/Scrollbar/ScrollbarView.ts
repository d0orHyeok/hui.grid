import { View } from '@/components/core';

export default class ScrollbarView extends View {
  template(): string {
    return /*html*/ `
      <div class="hui-scrollthumb">
        <div class="hui-scrollthumb-content"></div>
      </div>
    `;
  }
}
