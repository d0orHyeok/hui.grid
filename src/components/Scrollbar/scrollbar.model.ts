import Model from '@/mvc/Model';

export type ScrollbarPosition = 'vertical' | 'horizontal';

export interface ScrollbarState {
  position: ScrollbarPosition;
}

export default class ScrollbarModel extends Model<ScrollbarState> {}
