import { Observable } from '@t/observable';

export interface ViewportState {
  width: number;
  height: number;
}

export type Viewport = Observable<ViewportState>;
