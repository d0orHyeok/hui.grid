import observable from '@/observable';

export function create() {
  return observable({ width: 0, height: 0 });
}
