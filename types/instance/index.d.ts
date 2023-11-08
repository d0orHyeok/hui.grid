import { Source } from '@t/instance/source';
import { Column } from '@t/instance/column';
import { Demension } from '@t/instance/demension';

export interface Instance {
  column: Column;
  demension: Demension;
  source: Source;
}
