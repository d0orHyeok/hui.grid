import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';

export interface DemensionParams {
  opts: Observable<OptGrid>;
}

export type Demension = Observable<{
  height: number | string;
  rowHeight: number;
  width: number | string;
}>;
