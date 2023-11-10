import observable from '@/observable';
import { Demension, DemensionParams } from '@t/instance/demension';

const HEIGHT = 300;
const ROW_HEIGHT = 32;
const MIN_ROW_HEIGHT = 24;

export function create({ opts }: DemensionParams): Demension {
  const demension: Demension = observable(() => {
    const height = opts().height ?? HEIGHT;
    const rowHeight = Math.max(opts().rowHeight ?? ROW_HEIGHT, MIN_ROW_HEIGHT);
    const width = opts().width ?? 'auto';
    return { height, rowHeight, width };
  });
  return demension;
}
