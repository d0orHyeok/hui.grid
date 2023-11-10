import observable from '@/observable';
import { generateId, isNull, isUndefined } from '@/utils/common';
import { DataObject } from '@t/index';
import { Source, SourceChanges, SourceData, SourceParams } from '@t/instance/source';
import { isEqual } from 'lodash-es';

const defaultKeyField = 'key';

export function create(param: SourceParams): Source {
  const store = observable<SourceData[]>([]);
  const changes = observable<SourceChanges>({});

  function update(key: string, data: Partial<DataObject>) {
    const exist = changes()[key] ?? {};
    const prevUpdate = exist.type === 'update' ? exist.data : {};
    const nowUpdate = { ...prevUpdate, ...data };
    changes()[key] = { type: 'update', key, data: nowUpdate };
    changes.publish();
  }

  function remove(key: string) {
    changes()[key] = { type: 'remove', key };
    changes.publish();
  }

  const source: Source = {
    _key: param().keyExpr ?? defaultKeyField,
    get key() {
      return this._key;
    },
    set key(key: string) {
      this._key = key;
    },
    _changes: changes,
    store,
    items: () => store(),
    changes: () => Object.values(changes()),
    setData(datas: DataObject[]) {
      changes({});
      const arr = store();
      arr.length = 0;
      datas.forEach((data) => {
        const key = data[this.key];
        if (isUndefined(key) || isNull(key)) throw new Error(`There's no key field in data object`);
        arr.push({ data, key, type: 'data' });
      });
      store.publish();
    },
    insert(...datas: DataObject[]) {
      datas.forEach((data) => {
        const key = data[this.key] ?? generateId();
        changes()[key] = { type: 'insert', key, data };
      });
      changes.publish();
    },
    update,
    remove,
    clear() {
      this.setData([]);
    },
  };

  param.subscribe((cur, prev) => {
    if (isEqual(cur, prev)) return;
    const { keyExpr, datas } = cur;
    source.key = keyExpr ?? defaultKeyField;
    source.setData(datas ?? []);
  });

  return source;
}
