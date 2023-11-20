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

  /**
   * Sync scroll offsets
   * @private
   */
  private _syncScrollbarPosition() {
    const { $thumb } = this.view;
    const isVertical = this.state.position === 'vertical';
    const direction = isVertical ? 'Y' : 'X';

    this.state.instance[isVertical ? 'rowCoords' : 'columnCoords'].coords.subscribe((state) => {
      const { scrollbarSize, scrollThumbSize, translate } = state;
      const isDiabled = scrollThumbSize >= scrollbarSize;
      this.view[isDiabled ? 'hide' : 'show']();
      $thumb.style[isVertical ? 'height' : 'width'] = scrollThumbSize + 'px';
      $thumb.style.transform = `translate${direction}(${translate}px)`;
    });
  }

  /**
   * Make elements scrollable
   * @private
   */
  private _makeScrollable() {
    const { $thumb, $target } = this.view;
    const isVertical = this.state.position === 'vertical';
    const direction = isVertical ? 'Y' : 'X';
    const position = isVertical ? 'Top' : 'Left';

    const root = this.state.instance.root;
    const item = this.state.instance[isVertical ? 'rowCoords' : 'columnCoords'];
    const { scrollPos, coords } = item;

    const $headerContainer = find$(`.${root} .${cn('header')} .hui-grid-scroll-container`) as HTMLElement;
    const $container = $target.closest('.hui-grid-scroll-container') as HTMLElement;
    // Sync scroll position
    scrollPos.subscribe((state) => {
      const key: 'scrollTop' | 'scrollLeft' = `scroll${position}`;
      $container[key] = state;
      if (!isVertical) $headerContainer[key] = state;
    });

    // Bind scrolling event
    const $grid = find$(`.${root}`) as HTMLElement;
    customScroll(direction, isVertical ? $container : $grid, item);

    // Bind thumb drag event
    const onTranslate = (deltaTranslate: number) => {
      const { scrollSize, translate, scrollbarSize } = coords();
      const newScrollTop = Math.max(((translate + deltaTranslate) * scrollSize) / scrollbarSize, 0);
      scrollPos(newScrollTop);
    };
    customScrollDrag(direction, { scrollbar: $target, scrollthumb: $thumb }, onTranslate);

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
      const { scrollThumbSize, maxScrollPos, translate } = coords();
      const minOffset = Math.max(offset - scrollThumbSize, 0);
      const multiplier = offset < (translate + translate + scrollThumbSize) / 2 ? -1 : 1;
      const delta = 100 * multiplier;
      trackId = setInterval(() => {
        if (!isTracking) clearInterval(trackId);
        scrollPos(clamp(scrollPos() + delta, 0, maxScrollPos));
        const changeY = coords().translate;
        if ((multiplier > 0 && changeY > minOffset) || (multiplier < 0 && changeY < offset)) isTracking = false;
      }, 33);
    });
  }
}
