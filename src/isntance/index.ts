import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';
import { Instance } from '@t/instance';
import { create as createSource } from '@/isntance/source';
import { create as createColumn } from '@/isntance/column';
import { create as createDemension } from '@/isntance/demension';
import { create as createRowCoords } from '@/isntance/rowCoords';
import { create as createViewport } from '@/isntance/viewport';
import { create as createColumnCoords } from '@/isntance/columnCoords';
import { create as createEdit } from '@/isntance/edit';
import { generateId } from '@/utils/common';
import { find$ } from '@/utils/dom';
import { effect } from '@/observable';

export default function createInstance(opts: Observable<OptGrid>): Instance {
  const root = `hui-${generateId()}`;
  // Create viewport
  const viewport = createViewport();
  // Create column
  const column = createColumn(opts);
  // Create Demension
  const demension = createDemension({ opts });
  //  Create Edit
  const edit = createEdit(opts);
  // Create source
  const source = createSource({ opts, column });
  // Create RowCoords
  const rowCoords = createRowCoords({ demension, source, viewport });
  // Create ColumnCoords
  const columnCoords = createColumnCoords({ column, edit, viewport });

  effect(
    ({ accessKey }) => {
      const $el = find$('.' + root);
      if ($el) !accessKey ? $el.removeAttribute('accesskey') : ($el.accessKey = accessKey);
    },
    [opts],
    (s) => s.accessKey,
    undefined
  );

  return { root, column, columnCoords, demension, edit, rowCoords, source, viewport };
}
