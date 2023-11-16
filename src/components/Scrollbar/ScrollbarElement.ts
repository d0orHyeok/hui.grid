import { Component } from '@/components/core';
import ScrollbarView from './ScrollbarView';
import { DefaultState } from '@t/components';
import { cn } from '@/healpers/className';
import { customScroll, customScrollDrag } from '@/healpers/scroll';
import { find$, on } from '@/utils/dom';
import { clamp } from '@/utils/common';

export type ScrollbarPosition = 'vertical' | 'horizontal';

export interface ScrollbarState extends DefaultState {
  position: ScrollbarPosition;
}

export default class ScrollbarElement extends Component<ScrollbarView, ScrollbarState> {
  init(): void {
    this._syncScrollbarPosition();
    this._makeScrollable();
  }

  private _syncScrollbarPosition() {
    const { $thumb } = this.view;
    if (this.state.position === 'vertical') {
      const { rowCoords } = this.state.instance;
      const { coords } = rowCoords;
      coords.subscribe((state) => {
        const { scrollbarHeight, scrollThumbHeight, translateY } = state;
        const isDiabled = scrollThumbHeight >= scrollbarHeight;
        this.view[isDiabled ? 'hide' : 'show']();
        $thumb.style.height = scrollThumbHeight + 'px';
        $thumb.style.transform = `translateY(${translateY}px)`;
      });
    }
  }

  private _makeScrollable() {
    const { $thumb, $target } = this.view;
    if (this.state.position === 'vertical') {
      const { root, rowCoords } = this.state.instance;
      const { coords, scrollTop } = rowCoords;

      // Sync scrollTop
      scrollTop.subscribe((state) => {
        $container.scrollTop = state;
      });

      // Bind scrolling event
      const $container = find$(`.${root} .${cn('body')} .hui-grid-scroll-container`) as HTMLElement;
      const fns = { getStart: scrollTop, getMax: () => coords().maxScrollTop };
      customScroll('y', $container, fns, scrollTop);

      // Bind thumb drag event
      const onTranslate = (deltaTranslateY: number) => {
        const { scrollHeight, translateY, scrollbarHeight } = coords();
        const newScrollTop = Math.max(((translateY + deltaTranslateY) * scrollHeight) / scrollbarHeight, 0);
        scrollTop(newScrollTop);
      };
      customScrollDrag('y', { scrollbar: $target, scrollthumb: $thumb }, onTranslate);

      // Tracking mouse offset
      // Move scrollThumb to mouse offset
      let isTracking = false;
      let trackId = -1;
      on($target, 'mouseleave', () => (isTracking = false));
      on($target, 'mouseup', () => (isTracking = false));
      on($target, 'mousedown', (event) => {
        event.stopPropagation();
        clearInterval(trackId);
        if ($thumb.contains(event.target as Node)) return (isTracking = false);
        isTracking = true;

        const offset = event.offsetY;
        const { scrollThumbHeight, maxScrollTop, translateY } = coords();
        const minOffset = Math.max(offset - scrollThumbHeight, 0);
        const multiplier = offset < (translateY + translateY + scrollThumbHeight) / 2 ? -1 : 1;
        const delta = 100 * multiplier;
        trackId = setInterval(() => {
          if (!isTracking) clearInterval(trackId);
          scrollTop(clamp(scrollTop() + delta, 0, maxScrollTop));
          const changeY = coords().translateY;
          if ((multiplier > 0 && changeY > minOffset) || (multiplier < 0 && changeY < offset)) isTracking = false;
        }, 33);
      });
    }
  }
}
