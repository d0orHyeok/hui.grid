import { RowCoords } from '@t/instance/rowCoords.d';
import { RowCoordsParam } from '@t/instance/rowCoords';
import observable from '@/observable';

const MIN_SCROLL_THUMB = 20;

export function create({ demension, source, viewport }: RowCoordsParam): RowCoords {
  const offsets = observable([0, 0]);

  const scrollTop = observable(0);

  const coords = observable(() => {
    const totalItemCount = source.items()?.length ?? 0;
    const rowHeight = demension().rowHeight;
    const totalRowHeight = rowHeight * totalItemCount;
    const viewportHeight = viewport().height;
    const nodePadding = 5;

    const pageNodeCount = Math.ceil(viewportHeight / rowHeight);
    const visibleNodeCount = pageNodeCount + 2 * nodePadding;

    let startNode = Math.floor(scrollTop() / rowHeight) - nodePadding;
    startNode = Math.max(0, startNode);
    if (visibleNodeCount >= totalItemCount) startNode = 0;
    else if (startNode >= totalItemCount - visibleNodeCount) startNode = totalItemCount - visibleNodeCount;
    offsets([startNode, startNode + visibleNodeCount]);

    const scrollHeight = totalRowHeight;
    const thumbRatio = viewportHeight / scrollHeight;
    const thumbHeight = isNaN(thumbRatio) ? 0 : Math.round(viewportHeight * thumbRatio * 100) / 100;
    const scrollThumbHeight = Math.max(thumbHeight, MIN_SCROLL_THUMB);
    const scrollThumbDiff = scrollThumbHeight - thumbHeight;
    const translateRatio = scrollTop() / scrollHeight;
    const scrollbarHeight = viewportHeight - scrollThumbDiff;
    const translateY = Math.min(
      (isNaN(translateRatio) ? 0 : translateRatio) * scrollbarHeight,
      viewportHeight - scrollThumbHeight
    );

    const item = {
      maxScrollTop: Math.max(scrollHeight - viewportHeight, 0),
      scrollbarHeight,
      scrollHeight,
      scrollThumbHeight,
      totalRowHeight,
      translateY,
    };
    return item;
  });

  return {
    scrollTop,
    coords,
    offsets,
  };
}
