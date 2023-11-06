import { Observable } from '@t/observable';
import { create as createSource } from '@/isntance/source';
import { OptGrid } from '@t/options';
import { Instance } from '@t/instance';
import observable from '@/observable';

export default function createInstance(opts: Observable<OptGrid>): Instance {
  // Create source
  const sourceParam = observable(() => ({ keyExpr: opts().keyExpr, datas: opts().datas }));
  const source = createSource(sourceParam);

  return { source };
}
