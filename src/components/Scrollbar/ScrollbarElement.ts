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
      // Vertical scroll
      const { rowCoords } = this.state.instance;
      const { coords } = rowCoords;
      coords.subscribe((state) => {
        const { scrollbarHeight, scrollThumbHeight, translateY } = state;
        const isDiabled = scrollThumbHeight >= scrollbarHeight;
        this.view[isDiabled ? 'hide' : 'show']();
        $thumb.style.height = scrollThumbHeight + 'px';
        $thumb.style.transform = `translateY(${translateY}px)`;
      });
    } else {
      // Horizontal scroll
      const { columnCoords } = this.state.instance;
      const { coords } = columnCoords;
      coords.subscribe((state) => {
        const { scrollThumbWidth, scrollbarWidth, translateX } = state;
        const isDiabled = scrollThumbWidth >= scrollbarWidth;
        this.view[isDiabled ? 'hide' : 'show']();
        $thumb.style.width = scrollThumbWidth + 'px';
        $thumb.style.transform = `translateX(${translateX}px)`;
      });
    }
  }

  private _makeScrollable() {
    const { $thumb, $target } = this.view;
    const $container = $target.closest('.hui-grid-scroll-container') as HTMLElement;
    if (this.state.position === 'vertical') {
      // Vertical scroll
      const { rowCoords } = this.state.instance;
      const { coords, scrollTop } = rowCoords;

      // Sync scrollTop
      scrollTop.subscribe((state) => {
        $container.scrollTop = state;
      });

      // Bind scrolling event
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
    } else {
      // Horizontal scroll
      const { columnCoords, root } = this.state.instance;
      const { coords, scrollLeft } = columnCoords;

      // Sync scrollTop
      const $headerContainer = find$(`.${root} .${cn('header')} .hui-grid-scroll-container`) as HTMLElement;
      scrollLeft.subscribe((state) => {
        $container.scrollLeft = state;
        $headerContainer.scrollLeft = state;
      });

      // Bind scrolling event
      const fns = { getStart: scrollLeft, getMax: () => coords().maxScrollLeft };
      customScroll('x', $container, fns, scrollLeft);

      // Bind thumb drag event
      const onTranslate = (deltaTranslateX: number) => {
        const { scrollWidth, translateX, scrollbarWidth } = coords();
        const newScrollLeft = Math.max(((translateX + deltaTranslateX) * scrollWidth) / scrollbarWidth, 0);
        scrollLeft(newScrollLeft);
      };
      customScrollDrag('x', { scrollbar: $target, scrollthumb: $thumb }, onTranslate);

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

        const offset = event.offsetX;
        const { scrollThumbWidth, maxScrollLeft, translateX } = coords();
        const minOffset = Math.max(offset - scrollThumbWidth, 0);
        const multiplier = offset < (translateX + translateX + scrollThumbWidth) / 2 ? -1 : 1;
        const delta = 100 * multiplier;
        trackId = setInterval(() => {
          if (!isTracking) clearInterval(trackId);
          scrollLeft(clamp(scrollLeft() + delta, 0, maxScrollLeft));
          const changeX = coords().translateX;
          if ((multiplier > 0 && changeX > minOffset) || (multiplier < 0 && changeX < offset)) isTracking = false;
        }, 33);
      });
    }
  }
}
