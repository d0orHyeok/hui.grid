import { clamp, isNull } from '@/utils/common';
import { animationThrottle, find$, on } from '@/utils/dom';

interface MoveScrollElementParam {
  scrollbar: Element;
  scrollthumb: Element;
}

export function customScrollDrag(
  direction: 'x' | 'y',
  scrollElements: MoveScrollElementParam,
  onTranslate: (translateDelta: number) => any
) {
  const $html = find$('html') as HTMLElement;
  const $target = scrollElements.scrollbar as HTMLElement;
  const $thumb = scrollElements.scrollthumb as HTMLElement;

  const eventKey: 'pageX' | 'pageY' = `page${direction.toUpperCase()}` as any;

  let start: number | null = null;
  let prevUserSelect = '';

  // Set thumb drag start point
  on($target, 'mousedown', (event) => {
    if ($thumb.contains(event.target as Node)) {
      start = event[eventKey];
      prevUserSelect = document.body.style.userSelect;
      $thumb.style.transition = 'none';
    }
  });
  // Disable thumb drag
  on($html, 'mouseup', () => {
    start = null;
    document.body.style.userSelect = prevUserSelect;
    $thumb.style.transition = '';
  });

  // Caculate translate delta
  on(document.body, 'mousemove', animationThrottle(onMouseMove));

  function onMouseMove(event: MouseEvent) {
    if (isNull(start)) return;
    event.preventDefault();
    document.body.style.userSelect = 'none';
    const pos = event[eventKey];
    const translateDelta = pos - start;
    start = pos;
    onTranslate(translateDelta);
  }
}

interface CustomScrollHelperFuctions {
  getStart: () => number;
  getMax: () => number;
}

export function customScroll(
  direction: 'x' | 'y',
  container: Element,
  { getMax, getStart }: CustomScrollHelperFuctions,
  onScroll: (scrollPos: number) => any
) {
  const $container = container as HTMLElement; // scrollable target
  const duration = 120; // scroll animation duration

  let animationId = -1;
  let animationDelta = 0;
  let animationStartTime: number | null = null;
  let start = 0; // start scroll position

  function moveScroll(delta: number) {
    if (animationId < 0) {
      start = getStart();
      animationDelta = 0;
      animationStartTime = null;
    }
    const maxScroll = getMax();
    animationDelta += delta;

    const frameScroll = (currentTime: number) => {
      if (isNull(animationStartTime)) animationStartTime = currentTime; // Set startTime
      const time = currentTime - animationStartTime;
      const radio = Math.min(time / duration, 1);
      const scrollPos = start + animationDelta * radio;
      onScroll(clamp(scrollPos, 0, maxScroll));
      if (scrollPos > maxScroll || scrollPos < 0) return cancelAnimationFrame(animationId), (animationId = -1);
      if (time < duration) animationId = requestAnimationFrame(frameScroll);
      else cancelAnimationFrame(animationId), (animationId = -1);
    };
    animationId = requestAnimationFrame(frameScroll);
  }

  on($container, 'wheel', (event) => {
    const isScroll = direction === 'x' ? event.shiftKey : !event.shiftKey;
    if (isScroll) moveScroll(event.deltaY);
  });
}
