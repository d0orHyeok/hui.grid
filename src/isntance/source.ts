import observable from '@/observable';
import { entries, generateId, isNull, isUndefined, values } from '@/utils/common';
import { DataObject } from '@t/index';
import { Source, SourceMutation, SourceData, SourceParams, GroupSourceData } from '@t/instance/source';
import { isEqual } from 'lodash-es';

const defaultKeyField = 'key';

export function create({ opts, column }: SourceParams): Source {
  const groupDataFields = column.groupColumnInfos.map(({ dataField }) => dataField);
  const param = observable(() => ({ keyExpr: opts().keyExpr, datas: opts().datas }));
  const store = observable<SourceData[]>([]);
  const mutation = observable<SourceMutation>({});
  const offsets = observable<number[]>([0, 0]);

  function update(key: string, data: Partial<DataObject>) {
    const exist = mutation()[key] ?? {};
    const prevUpdate = exist.type === 'update' ? exist.data : {};
    const nowUpdate = { ...prevUpdate, ...data };
    mutation({ ...mutation(), [key]: { type: 'update', key, data: nowUpdate } });
  }

  function setData(datas: DataObject[]) {
    const { keyExpr } = param();
    mutation({});
    const storeDatas: SourceData[] = datas.map((data) => {
      const key = data[keyExpr ?? defaultKeyField];
      if (isUndefined(key) || isNull(key)) throw new Error(`There's no key field in data object`);
      return { data, key, type: 'data' };
    });
    store(storeDatas);

    if (!datas.length) return;

    // Make id of group datas
    const groupListMap = datas.reduce((obj: DataObject<SourceData[]>, data) => {
      const keyList: any[] = [];
      const item: SourceData = { type: 'data', key: data[keyExpr ?? defaultKeyField], data };
      groupDataFields.forEach((dataField) => {
        keyList.push(data[dataField]);
        const id = JSON.stringify(keyList);
        if (isUndefined(obj[id])) obj[id] = [item];
        else obj[id].push(item);
      });
      return obj;
    }, {});

    // Make groupSourceData map
    const groupDataMap: DataObject<GroupSourceData & { parent?: string }> = {};
    entries(groupListMap, (id, items) => {
      const keys: any[] = JSON.parse(id);
      const parentKeyList = [...keys];
      parentKeyList.pop();
      const groupIndex = parentKeyList.length;
      const groupField = groupDataFields[groupIndex];
      const parent = groupIndex === 0 ? undefined : JSON.stringify(parentKeyList);
      const obj: GroupSourceData & { parent?: string } = { type: 'group', keys, groupIndex, groupField, items, parent };
      groupDataMap[id] = obj;
    });

    // Track parent node & replace items
    const visitMap: DataObject<boolean> = {};
    values(groupDataMap, (data) => {
      const { parent, ...groupSourceData } = data;
      if (parent) {
        const parentNode = groupDataMap[parent];
        if (!visitMap[parent]) (visitMap[parent] = true), (parentNode.items = []);
        parentNode.items.push(groupSourceData);
      }
    });

    // Make store datas
    const results: GroupSourceData[] = [];
    values(groupDataMap, (data) => {
      const { parent, ...groupSourceData } = data;
      if (!parent) results.push(groupSourceData);
    });

    console.log(results);
  }

  const source: Source = {
    keyExpr: param().keyExpr ?? defaultKeyField,
    mutation,
    offsets,
    store,
    changes: () => Object.values(mutation()),
    clear: () => setData([]),
    insert(...datas: DataObject[]) {
      datas.forEach((data) => {
        let key = data[this.keyExpr];
        if (isUndefined(key)) (key = generateId), (data[this.keyExpr] = key);
        mutation({ ...mutation(), [key]: { type: 'insert', key, data } });
      });
    },
    items: () => store(),
    remove: (key: string) => mutation({ ...mutation(), [key]: { type: 'remove', key } }),
    setData,
    update,
  };

  param.subscribe((cur, prev) => {
    if (isEqual(cur, prev)) return;
    const { keyExpr, datas } = cur;
    source.keyExpr = keyExpr ?? defaultKeyField;
    source.setData(datas ?? []);
  }, true);

  return source;
}
