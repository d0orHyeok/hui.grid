import { cn, cns } from '@/healpers/className';
import { View } from '@/components/core';

export default class HeaderView extends View {
  template(): string {
    return /*html*/ `
      <div class="${cn('scrollContainer')}" role="presentation">
        <table class="${cns('table', 'tableFixed').join(' ')}" role="presentation">
          <tbody role="presentation">
          </tbody>
        </table>
      </div>
    `;
  }
}
