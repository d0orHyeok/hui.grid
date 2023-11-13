import { RowCoords } from '@t/instance/rowCoords.d';
import { RowCoordsParam } from '@t/instance/rowCoords';
import observable from '@/observable';
import { cn } from '@/healpers/className';

export function create({ root, demension, source }: RowCoordsParam): RowCoords {
  const vHeight = document.querySelector<HTMLElement>(`.${root} .${cn('body')}`)?.offsetHeight ?? 0;
  const viewport = observable({ viewportHeight: vHeight, scrollTop: 0 });

  const offsets = observable([0, 0]);

  const scroll = observable(() => {
    const totalItemCount = source.items()?.length ?? 0;
    const rowHeight = demension().rowHeight;
    const totalRowHeight = rowHeight * totalItemCount;
    const { viewportHeight, scrollTop } = viewport();
    const nodePadding = 5;

    let startNode = Math.floor(scrollTop / rowHeight) - nodePadding;
    startNode = Math.max(0, startNode);

    const pageNodeCount = Math.ceil(viewportHeight / rowHeight);
    let visibleNodeCount = pageNodeCount + 2 * nodePadding;
    visibleNodeCount = Math.min(totalItemCount - startNode, visibleNodeCount);

    offsets([startNode, startNode + visibleNodeCount]);

    const scrollHeight = totalRowHeight;
    const thumbRadio = viewportHeight / scrollHeight;
    const scrollThumbHeight = isNaN(thumbRadio) ? 0 : Math.round(viewportHeight * thumbRadio * 100) / 100;
    const translateRadio = scrollTop / scrollHeight;
    const translateY = Math.min(
      Math.round((isNaN(translateRadio) ? 0 : translateRadio) * viewportHeight * 100) / 100,
      viewportHeight - scrollThumbHeight
    );

    return { translateY, scrollThumbHeight, scrollHeight, maxScrollTop: Math.max(scrollHeight - viewportHeight, 0) };
  });

  function calculateScrollTop(delta: number) {
    const { scrollTop } = viewport();
    if (delta < 0) return Math.max(0, scrollTop + delta);
    const { maxScrollTop } = scroll();
    return Math.min(maxScrollTop, scrollTop + delta);
  }

  return {
    viewport,
    scroll,
    offsets,
    moveScroll(delta: number) {
      viewport({ ...viewport(), scrollTop: calculateScrollTop(delta) });
    },
    moveTranslate(delta: number) {
      const { translateY, scrollHeight, maxScrollTop } = scroll();
      const { viewportHeight } = viewport();
      const changeY = Math.max(translateY + delta, 0);
      const newTop = Math.round(((changeY * scrollHeight) / viewportHeight) * 100) / 100;
      const scrollTop = isNaN(newTop) ? 0 : Math.min(maxScrollTop, newTop);
      viewport({ viewportHeight, scrollTop });
    },
  };
}
