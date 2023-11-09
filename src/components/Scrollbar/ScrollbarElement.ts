import { Component } from '@/components/core';
import ScrollbarView from './ScrollbarView';
import { DefaultState } from '@t/components';

export type ScrollbarPosition = 'vertical' | 'horizontal';

export interface ScrollbarState extends DefaultState {
  position: ScrollbarPosition;
}

export default class ScrollbarElement extends Component<ScrollbarView, ScrollbarState> {
  init(): void {
    this.view.setPosition(this.state.position);
  }
}
