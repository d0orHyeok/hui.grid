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
  scrollbarHeight: number;
  translateY: number;
  scrollThumbHeight: number;
  scrollHeight: number;
  maxScrollTop: number;
}

export interface RowCoords {
  scrollTop: Observable<number>;
  offsets: Observable<number[]>;
  coords: Observable<VerticaScrolllCoords>;
}
