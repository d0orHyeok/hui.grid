import { cn, cns } from '@/healpers/className';
import { View } from '@/components/core';

export default class BodyView extends View {
  template(): string {
    return /*html*/ `
      <div class="${cn('scrollWrapper')}">
        <div class="${cn('scrollContainer')}">
          <div class="${cn('scrollContent')}">
            <div class="hui-grid-table-content">
              <table role="presentation" class="${cns('table', 'tableFixed').join(' ')}" >
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
