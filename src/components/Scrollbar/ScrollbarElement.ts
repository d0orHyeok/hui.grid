import { Component } from '@/components/core';
import ScrollbarView from './ScrollbarView';
import { DefaultState } from '@t/components';
import { animationThrottle, on } from '@/utils/dom';
import { isNull } from '@/utils/common';

export type ScrollbarPosition = 'vertical' | 'horizontal';

export interface ScrollbarState extends DefaultState {
  position: ScrollbarPosition;
}

export default class ScrollbarElement extends Component<ScrollbarView, ScrollbarState> {
  init(): void {
    this._syncRowCoords();
    this._bindVerticalScrollDragEvent();
  }

  private _syncRowCoords() {
    if (this.state.position !== 'vertical') return;
    const { $thumb } = this.view;
    const { rowCoords } = this.state.instance;
    const { scroll } = rowCoords;
    scroll.subscribe((state) => {
      const { scrollThumbHeight, translateY } = state;
      $thumb.style.height = scrollThumbHeight + 'px';
      $thumb.style.transform = `translateY(${translateY}px)`;
    });
  }

  private _bindVerticalScrollDragEvent() {
    if (this.state.position !== 'vertical') return;
    const $html = document.querySelector('html') as HTMLElement;
    const { $thumb, $target } = this.view;
    const { rowCoords } = this.state.instance;

    let startY: number | null = null;
    let prevUserSelect = '';

    on($target, 'mousedown', (event) => {
      if ($thumb.contains(event.target as Node)) {
        startY = event.pageY;
        prevUserSelect = document.body.style.userSelect;
        $thumb.style.transition = 'none';
      }
    });
    on($html, 'mouseup', () => {
      startY = null;
      document.body.style.userSelect = prevUserSelect;
      $thumb.style.transition = '';
    });

    function onMouseMove(event: MouseEvent) {
      if (isNull(startY)) return;
      event.preventDefault();
      document.body.style.userSelect = 'none';
      const pos = event.pageY;
      const deltaY = pos - startY;
      startY = pos;
      rowCoords.moveTranslate(deltaY);
    }

    on($html, 'mousemove', animationThrottle(onMouseMove));
  }
}
