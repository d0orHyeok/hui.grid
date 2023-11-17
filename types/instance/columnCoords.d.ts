import { Observable } from '@t/observable';
import { Column } from './column';
import { Viewport } from './viewport';

export interface ColumnCoordsParam {
  column: Column;
  viewport: Viewport;
}

export interface HorizontalScrolllCoords {
  maxScrollLeft: number;
  scrollbarWidth: number;
  scrollWidth: number;
  scrollThumbWidth: number;
  translateX: number;
  widths: number[];
}

export interface ColumnCoords {
  coords: Observable<HorizontalScrolllCoords>;
  scrollLeft: Observable<number>;
}
