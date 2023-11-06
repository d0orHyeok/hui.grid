import { Observable } from '@t/observable';
import { create as createSource } from '@/isntance/source';
import { OptGrid } from '@t/options';
import { Instance } from '@t/instance';

export default function createInstance(opts: Observable<OptGrid>): Instance {
  const options = opts();
  const { keyExpr } = options;

  const source = createSource({ keyExpr });

  return { source };
}
