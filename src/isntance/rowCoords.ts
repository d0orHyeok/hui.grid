import { RowCoords } from '@t/instance/rowCoords.d';
import { RowCoordsParam } from '@t/instance/rowCoords';
import observable from '@/observable';
import { cn } from '@/healpers/className';
import { isNull } from '@/utils/common';

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
    if (visibleNodeCount >= totalItemCount) startNode = 0;
    visibleNodeCount = Math.min(totalItemCount - startNode, visibleNodeCount);

    offsets([startNode, startNode + visibleNodeCount]);

    const scrollHeight = totalRowHeight;
    const thumbRatio = viewportHeight / scrollHeight;
    const thumbHeight = isNaN(thumbRatio) ? 0 : Math.round(viewportHeight * thumbRatio * 100) / 100;
    const scrollThumbHeight = thumbHeight;
    const translateRatio = scrollTop / scrollHeight;
    const translateY = Math.min(
      Math.round((isNaN(translateRatio) ? 0 : translateRatio) * viewportHeight * 100) / 100,
      viewportHeight - scrollThumbHeight
    );

    const item = {
      translateY,
      scrollThumbHeight,
      scrollHeight,
      maxScrollTop: Math.max(scrollHeight - viewportHeight, 0),
    };
    return item;
  });

  let animationId = -1;
  let animationDelta = 0;
  let animationStartTime: number | null = null;
  let startTop = 0;
  const duration = 120;

  function moveScroll(delta: number) {
    if (animationId < 0) {
      startTop = viewport().scrollTop;
      animationDelta = 0;
      animationStartTime = null;
    }
    const maxScrollTop = scroll().maxScrollTop;
    animationDelta += delta;

    const frameScroll = (currentTime: number) => {
      if (isNull(animationStartTime)) animationStartTime = currentTime;
      const time = currentTime - animationStartTime;
      const radio = Math.min(time / duration, 1);
      const scrollTop = startTop + animationDelta * radio;
      viewport({ ...viewport(), scrollTop: Math.min(Math.max(scrollTop, 0), maxScrollTop) });
      if (scrollTop > maxScrollTop || scrollTop < 0) return cancelAnimationFrame(animationId), (animationId = -1);
      if (time < duration) animationId = requestAnimationFrame(frameScroll);
      else cancelAnimationFrame(animationId), (animationId = -1);
    };
    animationId = requestAnimationFrame(frameScroll);
  }

  return {
    viewport,
    scroll,
    offsets,
    moveScroll(delta: number) {
      moveScroll(delta);
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
