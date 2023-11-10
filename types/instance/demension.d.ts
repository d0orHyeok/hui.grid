import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';

export interface DemensionParams {
  opts: Observable<OptGrid>;
}

export type Demension = Observable<{
  readonly height: number | string;
  readonly rowHeight: number;
  readonly width: number | string;
}>;
