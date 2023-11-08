import { HorizontalAlign, VerticalAlign } from '@t/options';
import { View } from '@/components/core';

export default class CellView extends View {
  template(): string {
    return /*html*/ `
      <td></td>
    `;
  }

  setAlign({ align, verticalAlign }: { align?: HorizontalAlign; verticalAlign?: VerticalAlign }) {
    this.style({ textAlign: align, verticalAlign });
  }

  renderTemplate(...templates: Array<string | Node>) {
    this.$target.replaceChildren(...templates);
  }
}
