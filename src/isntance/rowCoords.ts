import { RowCoords } from '@t/instance/rowCoords.d';
import { RowCoordsParam } from '@t/instance/rowCoords';
import observable from '@/observable';
import { clamp } from '@/utils/common';

const MIN_SCROLL_THUMB = 20;

const nodePadding = 5;

export function create({ demension, source, viewport }: RowCoordsParam): RowCoords {
  const scrollTop = observable(0);

  const coords = observable(() => {
    const totalItemCount = source.renderStore().length ?? 0;
    const { rowHeight } = demension();
    const totalRowHeight = rowHeight * totalItemCount;
    const viewportHeight = viewport().height;

    const scrollHeight = totalRowHeight;
    const pageNodeCount = Math.ceil(viewportHeight / rowHeight);
    const visibleNodeCount = pageNodeCount + 2 * nodePadding;

    const maxStart = totalItemCount - visibleNodeCount;
    let startNode = Math.floor(scrollTop() / rowHeight) - nodePadding;
    startNode = clamp(startNode, 0, maxStart);
    source.offsets([startNode, startNode + visibleNodeCount]);

    const thumbRatio = viewportHeight / scrollHeight;
    const thumbHeight = isNaN(thumbRatio)
      ? 0
      : thumbRatio === Infinity
      ? viewportHeight
      : Math.round(viewportHeight * thumbRatio * 100) / 100;
    const scrollThumbHeight = Math.max(thumbHeight, MIN_SCROLL_THUMB);
    const scrollThumbDiff = scrollThumbHeight - thumbHeight;
    const translateRatio = scrollTop() / scrollHeight;
    const scrollbarHeight = viewportHeight - scrollThumbDiff;
    const translateY = Math.min(
      (isNaN(translateRatio) ? 0 : translateRatio) * scrollbarHeight,
      viewportHeight - scrollThumbHeight
    );

    const item = {
      maxScrollPos: Math.max(scrollHeight - viewportHeight, 0),
      scrollbarSize: scrollbarHeight,
      scrollSize: scrollHeight,
      scrollThumbSize: scrollThumbHeight,
      translate: translateY,
    };
    return item;
  });

  return {
    scrollPos: scrollTop,
    coords,
  };
}
