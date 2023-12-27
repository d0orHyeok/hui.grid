import { Observable } from '@t/observable';
import { Column } from './column';
import { Viewport } from './viewport';
import { Edit } from './edit';

export interface ColumnCoordsParam {
  column: Column;
  edit: Edit;
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
  customWidths: Observable<Array<number | null>>;
  scrollPos: Observable<number>;
}
