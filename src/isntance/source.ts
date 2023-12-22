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
  SortItem,
  Sorter,
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

function createSorter(opts: SourceParams['opts']): Sorter {
  const defaultSorting = 'single';
  const sorts = observable<SortItem[]>([]);
  const sorting = observable(() => opts().sorting);

  let prev = sorting() ?? defaultSorting;
  sorting.subscribe((state) => {
    const cur = state ?? defaultSorting;
    if (cur === prev) return;
    prev = cur;
    switch (cur) {
      case 'none':
      case false:
        sorts([]);
        break;
      case 'single':
      case true:
        sorts(sorts().slice(-1));
        break;
    }
  });

  return {
    _sorts: sorts,
    insert: (item: SortItem) => {
      switch (sorting() ?? defaultSorting) {
        case 'none':
        case false:
          break;
        case 'single':
        case true:
          sorts([item]);
          break;
        case 'multiple':
          sorts([...sorts(), item]);
      }
    },
    remove: (field: string) => sorts(sorts().filter((item) => item.field !== field)),
    update: (field, sort) => sorts(sorts().map((item) => (item.field === field ? { field, sort } : item))),
    items: () => sorts(),
    clear: () => sorts([]),
    get: (field: string) => sorts().find((item) => item.field === field),
  };
}

export function create({ opts, column }: SourceParams): Source {
  const origin = observable<DataObject[]>([]);
  const param = observable(() => ({ keyExpr: opts().keyExpr, datas: opts().datas }));
  const mutation = observable<SourceMutation>({});
  const offsets = observable<number[]>([0, 0]);
  const sorter = createSorter(opts);

  const base: Source = { groupDataMap: {}, sorter } as Source;

  const store = observable<SourceData[]>(() => {
    const sortItems = sorter._sorts();
    const sortItemSize = sortItems.length;
    const datas = origin();
    const { groupColumnInfos } = column;
    const { keyExpr } = param();

    const sortedDatas = (() => {
      if (sortItemSize) {
        function comparePriority(a: DataObject, b: DataObject) {
          const compare = sortItems.reduce((acc, { field, sort }, index) => {
            const multi = Math.pow(10, sortItemSize - index);
            const v1 = a[field];
            const v2 = b[field];
            const values = sort === 'asc' ? [v1, v2] : [v2, v1];
            return acc + multi * String(values[0]).localeCompare(String(values[1]), undefined, { numeric: true });
          }, 0);
          return compare;
        }
        return [...datas].sort(comparePriority);
      } else return datas;
    })();

    mutation({});
    if (groupColumnInfos.length) {
      // if group
      const results = createGroupItems(sortedDatas, column.groupColumnInfos, keyExpr);
      base.groupDataMap = results.groupDataMap;
      return results.datas;
    } else {
      // if not group
      const sourceDatas = sortedDatas.map((data) => createDataItem(data, keyExpr));
      return sourceDatas;
    }
  });

  const renderStore = observable(() => {
    const sourceDatas = store();
    const results: RenderStoreData[] = [];
    let rowindex = 0;
    let dataindex = 0;
    const pushData = (item: SourceData, skip = false) => {
      rowindex += 1;
      const isGroup = item.type === 'group';
      if (!skip) results.push(Object.assign(item, { rowindex, dataindex: isGroup ? undefined : dataindex }));
      if (isGroup) item.items.forEach((child) => pushData(child, !item.expanded || skip));
      else dataindex += 1;
    };
    sourceDatas.forEach((data) => pushData(data));
    return results;
  });

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
    clear: () => opts({ ...opts(), datas: [] }),
    insert(...datas: DataObject[]) {
      datas.forEach((data) => {
        let key = data[this.keyExpr];
        if (isUndefined(key)) (key = generateId), (data[this.keyExpr] = key);
        mutation({ ...mutation(), [key]: { type: 'insert', key, data } });
      });
    },
    items: () => store(),
    remove: (key: string) => mutation({ ...mutation(), [key]: { type: 'remove', key } }),
    setData: (datas: DataObject[]) => origin(datas),
    update: (key: string, data: Partial<DataObject>) => {
      const exist = mutation()[key] ?? {};
      const prevUpdate = exist.type === 'update' ? exist.data : {};
      const nowUpdate = { ...prevUpdate, ...data };
      mutation({ ...mutation(), [key]: { type: 'update', key, data: nowUpdate } });
    },
  } as Source;

  const source = Object.assign(base, extend);

  let prevParam: any = param();
  param.subscribe((cur) => {
    if (isEqual(cur, prevParam)) return;
    const { keyExpr, datas } = cur;
    source.keyExpr = keyExpr ?? defaultKeyField;
    source.setData(datas ?? []);
  }, true);

  return source;
}
