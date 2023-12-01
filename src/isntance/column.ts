import { alignMap } from '@/healpers/dataMap';
import observable from '@/observable';
import { arrayToMap, isNumber, isString, isUndefined, mapProp } from '@/utils/common';
import { DataObject } from '@t/index';
import {
  Column,
  ColumnInfo,
  ColumnInfoData,
  GroupColumnInfo,
  ColumnHeaderInfo,
  ColumnHeaderInfoData,
} from '@t/instance/column';
import { Observable } from '@t/observable';
import { OptColumn, OptCommonColumn, OptGrid } from '@t/options';

const getDepth = (items: any[]): number =>
  !Array.isArray(items) ? 0 : 1 + Math.max(...items.map((item) => getDepth(item.columns)));

function createColumnInfo(column: OptColumn, data: ColumnInfoData): ColumnInfo {
  const {
    align,
    allowEditing,
    allowFiltering,
    allowGrouping,
    booleanText,
    calculateCellValue,
    cellTemplate,
    className,
    dataField = '',
    dataType,
    calculateDisplayValue,
    minWidth,
    setCellValue,
    verticalAlign = 'middle',
    visible = true,
    width,
  } = column;

  const columnInfo = {
    ...data,
    align: align ?? (!isUndefined(dataType) ? alignMap[dataType] : undefined),
    allowEditing,
    allowFiltering,
    allowGrouping,
    booleanText,
    calculateCellValue,
    calculateDisplayValue,
    cellTemplate,
    className,
    dataField,
    dataType,
    minWidth,
    setCellValue,
    verticalAlign,
    visible,
    width,
  };
  return columnInfo;
}

function createColumnHeaderInfo(column: OptColumn, data: ColumnHeaderInfoData): ColumnHeaderInfo {
  const {
    allowResizing,
    allowSorting,
    caption,
    className,
    dataField,
    visible = true,
    width,
    headerCellTemplate,
    minWidth,
  } = column;

  const columnInfo = {
    ...data,
    allowResizing,
    allowSorting,
    caption: caption ?? dataField ?? '',
    className,
    dataField,
    headerCellTemplate,
    minWidth,
    visible,
    width,
  };

  return columnInfo;
}

function createGroupColumnInfo(column: OptColumn, index: number): GroupColumnInfo {
  const { booleanText, dataField = '', dataType, groupCellTemplate, groupValue, visible = true } = column;
  return { booleanText, dataField, dataType, groupCellTemplate, groupIndex: index, groupValue, visible };
}

/**
 * Create columnInfos
 */
function classifiyOptColumn(optColumns: OptColumn[]) {
  const rowSize = getDepth(optColumns);
  const duplicatedSet: Set<string> = new Set(); // for check data field
  const colindexMap: Map<number, number> = new Map(); // for make column header index
  const optDataColumns: OptColumn[] = [];
  const optGroupColumns: OptColumn[] = [];

  const createAndClassification = (optCols: OptColumn[] | undefined, depth: number = 1) => {
    if (!Array.isArray(optCols)) return undefined;
    return optCols.map((optCol) => {
      // Check data field
      const { dataField, groupIndex } = optCol;
      if (isString(dataField)) {
        if (duplicatedSet.has(dataField)) throw new Error(`DataField "${dataField}" is duplicated`);
        duplicatedSet.add(dataField);
        if (isNumber(groupIndex)) optGroupColumns.push(optCol); // if opt column has 'groupIndex' push column
      }
      // Make Column Index
      const colindex = (colindexMap.get(depth) ?? 0) + 1;
      colindexMap.set(depth, colindex);
      // Make col & row span
      const childLength = optCol.columns?.length;
      const colSpan = childLength ?? 1;
      const rowSpan = childLength ? 1 : rowSize - depth + 1;
      // Create column info
      const data = { colSpan, rowSpan, colindex, rowindex: depth };
      const columnHeaderInfo = createColumnHeaderInfo(optCol, data);
      const children = createAndClassification(optCol.columns, depth + 1);
      columnHeaderInfo.columns = children;
      if (!Array.isArray(children)) {
        optDataColumns.push(optCol);
      }
      return columnHeaderInfo;
    });
  };

  const columnHeaderInfos = createAndClassification(optColumns) ?? [];
  const columnInfos = optDataColumns.map((optCol, index) => createColumnInfo(optCol, { colindex: index + 1 }));
  const groupColumnInfos = optGroupColumns
    .sort((a, b) => (a.groupIndex as number) - (b.groupIndex as number))
    .map((optCol, index) => createGroupColumnInfo(optCol, index));

  return { columnInfos, groupColumnInfos, columnHeaderInfos, rowSize };
}

/**
 * Create column instance
 */
export function create(opts: Observable<OptGrid>): Column {
  const optColumns = opts().columns;
  const commonOptions: Observable<OptCommonColumn> = observable(() => {
    const { allowColumnResizing, columnMinWidth, columnWidth, dateFormat } = opts();
    const obj: OptCommonColumn = {
      allowColumnResizing: allowColumnResizing ?? true,
      columnMinWidth,
      columnWidth,
      dateFormat: dateFormat ?? 'YYYY-MM-DD',
    };
    return obj;
  });

  const { columnInfos, columnHeaderInfos, groupColumnInfos, rowSize } = classifiyOptColumn(optColumns);

  const column: Column = {
    commonOptions,
    columnInfos,
    columnHeaderInfos,
    groupColumnInfos,
    headerRowCount: rowSize,
    get columnDataFields() {
      return mapProp(this.columnInfos, 'dataField');
    },
    get columnInfoMap() {
      return arrayToMap(this.columnInfos, 'dataField');
    },
    get indexColumnHeaderInfoMap() {
      const map: DataObject<ColumnHeaderInfo[]> = {};
      const add = (datas: any[]) => {
        datas.forEach((item) => {
          if (isUndefined(map[item.rowindex])) map[item.rowindex] = [];
          map[item.rowindex].push(item);
          if (Array.isArray(item.columns)) add(item.columns);
        });
      };
      add(this.columnHeaderInfos);
      return map;
    },
    get visibleColumnInfos() {
      return this.columnInfos.filter(({ visible }) => visible);
    },
  };
  return column;
}
