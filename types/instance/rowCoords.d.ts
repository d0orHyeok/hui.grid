import { Observable } from '@t/observable';
import { Demension } from '@t/instance/demension';
import { Source } from '@t/instance/source';
import { Viewport } from '@t/instance/viewport';

export interface RowCoordsParam {
  demension: Demension;
  source: Source;
  viewport: Viewport;
}

export interface VerticaScrolllCoords {
  maxScrollTop: number;
  scrollbarHeight: number;
  scrollHeight: number;
  scrollThumbHeight: number;
  totalRowHeight: number;
  translateY: number;
}

export interface RowCoords {
  scrollTop: Observable<number>;
  offsets: Observable<number[]>;
  coords: Observable<VerticaScrolllCoords>;
}
