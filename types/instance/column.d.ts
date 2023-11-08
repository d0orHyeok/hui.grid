import { DataType } from './../options.d';
import {
  DataType,
  DisplayText,
  GroupValueFunction,
  HorizontalAlign,
  OptCommonColumn,
  SetCellValue,
  VerticalAlign,
} from '@t/options';
import { DataObject } from '..';
import { Observable } from '@t/observable';

export interface Column {
  commonOptions: Observable<OptCommonColumn>;
  columnInfos: ColumnInfo[];
  columnHeaderInfos: ColumnHeaderInfos[];
  groupColumnInfos: GroupColumnInfo[];
  headerRowCount: number;
  readonly columnDataFields: string[];
  readonly columnInfoMap: DataObject<ColumnInfo>;
  readonly visibleColumnInfos: ColumnInfo[];
  readonly visibleGroupColumnInfo: GroupColumnInfo[];
}

export interface ColumnInfo extends ColumnInfoData {
  align?: HorizontalAlign;
  allowEditing?: Boolean;
  allowFiltering?: boolean;
  allowGrouping?: boolean;
  booleanText?: { trueText?: string; falseText?: string };
  calculateCellValue?: (rowData: DataObject) => any;
  cellTemplate?: Function;
  className?: string;
  dataField: string;
  dataType?: DataType;
  displayText?: DisplayText;
  minWidth?: number;
  setCellValue?: SetCellValue;
  vertialAlign?: VerticalAlign;
  visible: boolean;
  width?: number | string;
}

export interface ColumnInfoData {
  colindex: number;
}

export interface ColumnHeaderInfos extends ColumnHeaderInfoData {
  allowResizing?: boolean;
  caption: string;
  className?: string;
  columns?: ColumnHeaderInfos[];
  headerCellTemplate?: Function;
  minWidth?: number;
  visible: boolean;
  width?: number | string;
}

export interface ColumnHeaderInfoData {
  colindex: number;
  colSpan: number;
  rowSpan: number;
}

export interface GroupColumnInfo {
  booleanText?: { trueText?: string; falseText?: string };
  dataField: string;
  dataType?: DataType;
  groupCellTemplate?: Function;
  groupIndex?: number;
  groupValue?: string | GroupValueFunction;
  visible: boolean;
}
