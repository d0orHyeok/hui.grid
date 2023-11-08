import { cn } from '@/healpers/className';
import { View } from '@/components/core';

export default class BodyView extends View {
  template(): string {
    return /*html*/ `
      <div class="${cn('scrollWrapper')}">
        <div class="${cn('scrollContainer')}">
          <div class="${cn('scrollContent')}">
            <div class="hui-grid-table-content">
              <table role="presentation" class="${cn('table')} hui-table-fixed" >
                <tbody role="presentation">
                </tbody>
              </table>
            </div>
          </div >
          <div class="${cn('scrollbar')} hui-vscroll"></div>
          <div class="${cn('scrollbar')} hui-hscroll"></div>
        </div>
      </div>
      <span role="presentation" class="${cn('nodata')}">No Data</span>
    `;
  }
}
