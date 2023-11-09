import { Column } from '@t/instance/column';
import { Demension } from '@t/instance/demension';
import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';

interface DemensionParams {
  column: Column;
  opts: Observable<OptGrid>;
}

const HEIGHT = 300;
const ROW_HEIGHT = 32;
const MIN_ROW_HEIGHT = 24;

export function create({ column, opts }: DemensionParams) {
  const demension: Demension = {
    get headerHeight() {
      return column.headerRowCount * this.rowHeight;
    },
    get height() {
      return opts().height ?? HEIGHT;
    },
    get rowHeight() {
      return Math.max(opts().rowHeight ?? ROW_HEIGHT, MIN_ROW_HEIGHT);
    },
    get width() {
      return opts().width ?? 'auto';
    },
  };
  return demension;
}
