import { cn, cns } from '@/healpers/className';
import { View } from '@/components/core';
import { find$ } from '@/utils/dom';

export default class BodyView extends View {
  #tbody?: HTMLElement;

  get $tbody() {
    if (this.#tbody) return this.#tbody;
    else {
      const $tbody = find$(cn('.', 'table', ' tbody'), this.$target) as HTMLElement;
      this.#tbody = $tbody;
      return $tbody;
    }
  }

  get $thead() {
    return this.$tbody.previousElementSibling as HTMLElement;
  }

  get $tfoot() {
    return this.$tbody.nextElementSibling as HTMLElement;
  }

  template(): string {
    this.role('presentation');
    this.$target.classList.add(cn('body'));
    return /*html*/ `
      <div class="${cn('scrollWrapper')}">
        <div class="${cn('scrollContainer')}">
          <div class="${cn('scrollContent')}">
            <div class="hui-grid-table-content">
              <table role="presentation" class="${cns('table', 'tableFixed').join(' ')}" >
                <colgroup></colgroup>
                <thead role="presentation"></thead>
                <tbody role="presentation"></tbody>
                <tfoot role="presentation"></tfoot>
              </table>
            </div>
          </div >
          <div class="${cns('scrollbar', 'hscrollbar').join(' ')}"></div>
          <div class="${cns('scrollbar', 'vscrollbar').join(' ')}"></div>
        </div>
      </div>
      <span role="presentation" class="${cn('nodata')}">No Data</span>
    `;
  }
}
