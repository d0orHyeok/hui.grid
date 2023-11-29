import observable from '@/observable';
import { entries, generateId, isNull, isUndefined, values } from '@/utils/common';
import { DataObject } from '@t/index';
import { GroupColumnInfo } from '@t/instance/column';
import {
  Source,
  SourceMutation,
  SourceData,
  SourceParams,
  StoreGroupItem,
  StoreDataItem,
  RenderStoreData,
} from '@t/instance/source';
import { isEqual } from 'lodash-es';

const defaultKeyField = 'key';

/**
 * Create storeDataItem
 * @param {DataObject} data
 * @param {string} [keyExpr]
 * @returns {StoreDataItem}
 */
function createDataItem(data: DataObject, keyExpr: string = defaultKeyField): StoreDataItem {
  const key = data[keyExpr];
  if (isUndefined(key) || isNull(key)) throw new Error(`There's no key field in data object`);
  return { type: 'data', key, data };
}

interface TempStoreGroupItem extends StoreGroupItem {
  parent?: string;
}

/**
 * Create storeGroupItem list
 * @param {DataObject} datas
 * @param {GroupColumnInfo[]} groupColumnInfos
 * @param {string} [keyExpr]
 * @returns {StoreGroupItem[]}
 */
function createGroupItems(datas: DataObject[], groupColumnInfos: GroupColumnInfo[], keyExpr: string = defaultKeyField) {
  const groupDataFields = groupColumnInfos.map(({ dataField }) => dataField);

  // Make id of group datas
  const groupDataMap = datas.reduce((obj: DataObject<StoreDataItem[]>, data) => {
    const keyList: any[] = [];
    const item = createDataItem(data, keyExpr);
    groupDataFields.forEach((dataField) => {
      keyList.push(data[dataField]);
      const id = JSON.stringify(keyList);
      if (isUndefined(obj[id])) obj[id] = [item];
      else obj[id].push(item);
    });
    return obj;
  }, {});

  // Make groupSourceData map
  const sourceDataMap: DataObject<TempStoreGroupItem> = {};
  entries(groupDataMap, (id, items) => {
    const keys: any[] = JSON.parse(id);
    const parentKeyList = [...keys];
    parentKeyList.pop();
    const groupIndex = parentKeyList.length;
    const groupField = groupDataFields[groupIndex];
    const parent = groupIndex === 0 ? undefined : JSON.stringify(parentKeyList);
    const expanded = true;
    const obj: TempStoreGroupItem = { type: 'group', keys, groupIndex, groupField, items, parent, expanded };
    sourceDataMap[id] = obj;
  });

  // Track parent node & replace items
  const visitMap: DataObject<boolean> = {};
  const results: StoreGroupItem[] = [];

  values(sourceDataMap, (data) => {
    const parent = data.parent;
    delete data.parent;
    if (parent) {
      const parentNode = sourceDataMap[parent];
      if (!visitMap[parent]) (visitMap[parent] = true), (parentNode.items = []);
      parentNode.items.push(data);
    } else {
      results.push(data);
    }
  });

  return { datas: results, groupDataMap };
}

export function create({ opts, column }: SourceParams): Source {
  const param = observable(() => ({ keyExpr: opts().keyExpr, datas: opts().datas }));
  const store = observable<SourceData[]>([]);
  const mutation = observable<SourceMutation>({});
  const offsets = observable<number[]>([0, 0]);

  const renderStore = observable(() => {
    const sourceDatas = store();
    const results: RenderStoreData[] = [];
    let rowindex = 0;
    const pushData = (item: SourceData, skip = false) => {
      rowindex += 1;
      if (!skip) results.push(Object.assign(item, { rowindex }));
      if (item.type === 'group') item.items.forEach((child) => pushData(child, !item.expanded || skip));
    };
    sourceDatas.forEach((data) => pushData(data));
    return results;
  });

  function update(key: string, data: Partial<DataObject>) {
    const exist = mutation()[key] ?? {};
    const prevUpdate = exist.type === 'update' ? exist.data : {};
    const nowUpdate = { ...prevUpdate, ...data };
    mutation({ ...mutation(), [key]: { type: 'update', key, data: nowUpdate } });
  }

  const base: Source = { groupDataMap: {} } as Source;

  function setData(datas: DataObject[]) {
    const { groupColumnInfos } = column;
    const { keyExpr } = param();

    mutation({});
    if (groupColumnInfos.length) {
      // if group
      const results = createGroupItems(datas, column.groupColumnInfos, keyExpr);
      base.groupDataMap = results.groupDataMap;
      store(results.datas);
    } else {
      // if not group
      const sourceDatas = datas.map((data) => createDataItem(data, keyExpr));
      store(sourceDatas);
    }
  }

  const extend = {
    keyExpr: param().keyExpr ?? defaultKeyField,
    get count() {
      return store().length;
    },
    mutation,
    offsets,
    renderStore,
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
  } as Source;

  const source = Object.assign(base, extend);

  param.subscribe((cur, prev) => {
    if (isEqual(cur, prev)) return;
    const { keyExpr, datas } = cur;
    source.keyExpr = keyExpr ?? defaultKeyField;
    source.setData(datas ?? []);
  }, true);

  return source;
}
