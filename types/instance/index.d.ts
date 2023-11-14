import { Source } from '@t/instance/source';
import { Column } from '@t/instance/column';
import { Demension } from '@t/instance/demension';
import { RowCoords } from '@t/instance/rowCoords';
import { Viewport } from '@t/instance/viewport';

export interface Instance {
  /** The instance id, also use grid's className */
  root: string;
  column: Column;
  demension: Demension;
  source: Source;
  rowCoords: RowCoords;
  viewport: Viewport;
}
