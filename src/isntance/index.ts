import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';
import { Instance } from '@t/instance';
import observable from '@/observable';
import { create as createSource } from '@/isntance/source';
import { create as createColumn } from '@/isntance/column';
import { create as createDemension } from '@/isntance/demension';
import { generateId } from '@/utils/common';

export default function createInstance(opts: Observable<OptGrid>): Instance {
  const root = `hui-${generateId()}`;
  // Create column
  const column = createColumn(opts);
  // Create Demension
  const demension = createDemension({ column, opts });
  // Create source
  const sourceParam = observable(() => ({ keyExpr: opts().keyExpr, datas: opts().datas }));
  const source = createSource(sourceParam);

  return { root, column, demension, source };
}
