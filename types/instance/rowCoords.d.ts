import { Observable } from '@t/observable';
import { Demension } from './demension';
import { Source } from './source';

export interface RowCoordsParam {
  root: string;
  demension: Demension;
  source: Source;
}

export interface CalCulateVirtualScrollParam {
  scrollTop: number;
  viewportHeight: number;
}

export interface CalculateVirtualScrollValues {
  offset: number[];
  previusOffset: number[] | null;
  translateY: number;
  scrollThumbHeight: number;
  totalItemCount: number;
}

export type CalculateVirtualScroll = (param: CalCulateVirtualScrollParam) => CalculateVirtualScrollValues;

export interface RowCoords {
  viewport: Observable<{
    viewportHeight: number;
    scrollTop: number;
  }>;
  coords: Observable<{
    offset: number[];
    previusOffset: number[] | null;
    translateY: number;
    scrollThumbHeight: number;
    totalItemCount: number;
    scrollHeight: number;
  }>;
  moveScroll: (delta: number) => void;
}
