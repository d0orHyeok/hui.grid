import { cn } from '@/data/className';
import View from '@/mvc/View';

export default class HeaderView extends View {
  template(): string {
    return /*html*/ `
      <div class="hui-grid-scroll-container" role="presentation">
        <table class="${cn('table')}" role="presentation">
          <tbody role="presentation">
          </tbody>
        </table>
      </div>
    `;
  }
}
