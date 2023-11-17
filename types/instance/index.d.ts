import { Source } from '@t/instance/source';
import { Column } from '@t/instance/column';
import { Demension } from '@t/instance/demension';
import { RowCoords } from '@t/instance/rowCoords';
import { Viewport } from '@t/instance/viewport';
import { ColumnCoords } from '@t/instance/columnCoords';

export interface Instance {
  /** The instance id, also use grid's className */
  root: string;
  column: Column;
  columnCoords: ColumnCoords;
  demension: Demension;
  rowCoords: RowCoords;
  source: Source;
  viewport: Viewport;
}
