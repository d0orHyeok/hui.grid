import { Observable } from '@t/observable';
import { Column } from './column';
import { Viewport } from './viewport';

export interface ColumnCoordsParam {
  column: Column;
  viewport: Viewport;
}

export interface HorizontalScrolllCoords {
  maxScrollPos: number;
  scrollbarSize: number;
  scrollSize: number;
  scrollThumbSize: number;
  translate: number;
  widths: number[];
}

export interface ColumnCoords {
  coords: Observable<HorizontalScrolllCoords>;
  scrollPos: Observable<number>;
}
