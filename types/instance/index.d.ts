import { Source } from '@t/instance/source';
import { Column } from '@t/instance/column';

export interface Instance {
  column: Column;
  source: Source;
}
