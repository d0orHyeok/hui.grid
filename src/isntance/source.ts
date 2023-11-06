import observable from '@/observable';
import { generateId } from '@/utils/common';
import { DataObject } from '@t/index';
import { Source, SourceChanges, SourceParams } from '@t/instance/source';

export function create({ keyExpr = 'key' }: SourceParams): Source {
  const store = observable<DataObject[]>([]);
  const changes = observable<SourceChanges>({});

  function insert(...datas: DataObject[]) {
    datas.forEach((data) => {
      const key = data[keyExpr] ?? generateId();
      changes()[key] = { type: 'insert', key, data };
    });
    changes.publish();
  }

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
    store,
    items: () => store(),
    changes: () => Object.values(changes()),
    setData: (datas: DataObject[]) => (changes({}), store(datas)),
    insert,
    update,
    remove,
    clear() {
      this.setData([]);
    },
  };

  return source;
}
