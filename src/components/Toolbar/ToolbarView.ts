import { View } from '@/components/core';
import { cn } from '@/healpers/className';

export default class ToolbarView extends View {
  template(): string {
    this.role('presentation');
    this.$target.className = cn('toolbar');

    return /*html*/ `
      <div class="hui-grid-toolbar-container" style="padding-bottom:1rem;">
        <button><i class="ri-add-fill ri-lg"></i></button>
        <button><i class="ri-save-fill ri-lg"></i></button>
        <button><i class="ri-list-settings-fill ri-lg"></i></button>
        <button><i class="ri-corner-up-left-line ri-lg"></i></button>
      </div>
    `;
  }
}
