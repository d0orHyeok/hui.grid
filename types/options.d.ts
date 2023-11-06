import { DataObject } from '@t/index';

export interface OptGrid {
  accessKey?: string;
  allowColumnResizing?: boolean;
  columnMinWidth?: number;
  columns: OptColumn[];
  columnWidth?: number | string;
  datas?: DataObject[];
  dateFormat?: string;
  edit?: undefined; // Experimental
  focuedColumnIndex?: number;
  focusedRowIndex?: number;
  focusedRowKey?: number;
  height?: string | number;
  keyExpr?: string;
  nodata?: string | Element;
  selectedRowKey?: string[];
  selection?: 'single' | 'multiple';
  tabIndex?: number;
  width?: string | number;
}

export type HorizontalAlign = 'center' | 'left' | 'right';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

export interface OptColumn {
  align?: HorizontalAlign;
  allowEditing?: boolean;
  allowFiltering?: boolean;
  allowGrouping?: boolean;
  allowResizing?: boolean;
  booleanText?: { trueText?: string; falseText?: string };
  calculateCellValue?: (rowData: DataObject) => any;
  caption?: string;
  cellTemplate?: Function; // Experimental
  className?: string;
  columns?: OptColumn;
  dataField?: string;
  dataType?: DataType;
  displayField?: string;
  displayText?: DisplayText;
  groupCellTemplate?: Function; // Experimental
  groupField?: string;
  groupIndex?: number;
  headerCellTemplate?: Function; // Experimental
  minWidth?: number;
  setCellValue?: SetCellValue;
  visible?: boolean;
  width?: number | string;
}

export type DataType = 'string' | 'number' | 'boolaen' | 'date' | 'progress';
export type DisplayText = (cellInfo: { value: any; valueText: string }) => string;
export type SetCellValue = (newData, value, rowData) => void;
