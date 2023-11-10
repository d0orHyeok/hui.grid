import { RowCoords } from '@t/instance/rowCoords.d';
import { RowCoordsParam } from '@t/instance/rowCoords';
import observable from '@/observable';
import { cn } from '@/healpers/className';

export function create({ root, demension, source }: RowCoordsParam): RowCoords {
  let prevOffset: null | number[] = null;

  const vHeight = document.querySelector<HTMLElement>(`.${root} .${cn('body')}`)?.offsetHeight ?? 0;
  const viewport = observable({ viewportHeight: vHeight, scrollTop: 0 });

  const coords = observable(() => {
    const totalItemCount = source.items().length;
    const rowHeight = demension().rowHeight;
    const totalRowHeight = rowHeight * totalItemCount;
    const { viewportHeight, scrollTop } = viewport();
    const nodePadding = 5;

    let startNode = Math.floor(scrollTop / rowHeight) - nodePadding;
    startNode = Math.max(0, startNode);

    const pageNodeCount = Math.ceil(viewportHeight / rowHeight);
    let visibleNodeCount = pageNodeCount + 2 * nodePadding;
    visibleNodeCount = Math.min(totalItemCount - startNode, visibleNodeCount);

    const previusOffset = Array.isArray(prevOffset) ? [...prevOffset] : null;
    const offset = [startNode, startNode + visibleNodeCount];
    prevOffset = [...offset];

    const scrollHeight = Math.max(totalRowHeight - viewportHeight, 0);
    const thumbRadio = viewportHeight / totalRowHeight;
    const scrollThumbHeight = Math.round(viewportHeight * thumbRadio * 100) / 100;
    const translateRadio = scrollTop / scrollHeight;
    const translateY = Math.min(
      Math.round(translateRadio * viewportHeight * 100) / 100,
      viewportHeight - scrollThumbHeight
    );

    return { offset, previusOffset, translateY, scrollThumbHeight, totalItemCount, scrollHeight };
  });

  return {
    viewport,
    coords,
    moveScroll(delta: number) {
      const existViewport = viewport();
      if (delta < 0) viewport({ ...existViewport, scrollTop: Math.max(0, existViewport.scrollTop + delta) });
      else {
        const scrollHeight = coords().scrollHeight;
        viewport({ ...existViewport, scrollTop: Math.min(scrollHeight, existViewport.scrollTop + delta) });
      }
    },
  };
}
