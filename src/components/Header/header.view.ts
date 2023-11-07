import { cn } from '@/healpers/className';
import View from '@/mvc/View';

export default class HeaderView extends View {
  template(): string {
    return /*html*/ `
      <div class="${cn('scrollContainer')}" role="presentation">
        <table class="${cn('table')}" role="presentation">
          <tbody role="presentation">
          </tbody>
        </table>
      </div>
    `;
  }
}
