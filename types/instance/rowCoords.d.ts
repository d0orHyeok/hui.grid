import { Observable } from '@t/observable';
import { Demension } from '@t/instance/demension';
import { Source } from '@t/instance/source';
import { Viewport } from '@t/instance/viewport';

export interface RowCoordsParam {
  demension: Demension;
  source: Source;
  viewport: Viewport;
}

export interface VerticalScrolllCoords {
  maxScrollPos: number;
  scrollbarSize: number;
  scrollSize: number;
  scrollThumbSize: number;
  translate: number;
}

export interface RowCoords {
  scrollPos: Observable<number>;
  coords: Observable<VerticalScrolllCoords>;
}
