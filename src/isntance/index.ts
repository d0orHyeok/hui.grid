import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';
import { Instance } from '@t/instance';
import observable from '@/observable';
import { create as createSource } from '@/isntance/source';
import { create as createColumn } from '@/isntance/column';
import { create as createDemension } from '@/isntance/demension';
import { create as createRowCoords } from '@/isntance/rowCoords';
import { create as createViewport } from '@/isntance/viewport';
import { generateId } from '@/utils/common';

export default function createInstance(opts: Observable<OptGrid>): Instance {
  const root = `hui-${generateId()}`;
  // Create viewport
  const viewport = createViewport();
  // Create column
  const column = createColumn(opts);
  // Create Demension
  const demension = createDemension({ opts });
  // Create source
  const sourceParam = observable(() => ({ keyExpr: opts().keyExpr, datas: opts().datas }));
  const source = createSource(sourceParam);
  // Create RowCoords
  const rowCoords = createRowCoords({ demension, source, viewport });

  return { root, column, demension, source, rowCoords, viewport };
}
