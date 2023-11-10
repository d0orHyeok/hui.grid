import { HeaderColumnInfo } from '@t/instance/column';
import { CellTemplate, DataType } from './../options.d';
import {
  DataType,
  CalculateDisplayValue,
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
  columnHeaderInfos: ColumnHeaderInfo[];
  groupColumnInfos: GroupColumnInfo[];
  headerRowCount: number;
  readonly columnDataFields: string[];
  readonly columnInfoMap: DataObject<ColumnInfo>;
  readonly indexColumnHeaderInfoMap: DataObject<HeaderColumnInfo>;
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
  calculateDisplayValue?: CalculateDisplayValue;
  cellTemplate?: CellTemplate;
  className?: string;
  dataField: string;
  dataType?: DataType;
  minWidth?: number;
  setCellValue?: SetCellValue;
  verticalAlign?: VerticalAlign;
  visible: boolean;
  width?: number | string;
}

export interface ColumnInfoData {
  colindex: number;
}

export interface ColumnHeaderInfo extends ColumnHeaderInfoData {
  allowResizing?: boolean;
  caption: string;
  className?: string;
  columns?: ColumnHeaderInfo[];
  headerCellTemplate?: Function;
  minWidth?: number;
  visible: boolean;
  width?: number | string;
}

export interface ColumnHeaderInfoData {
  colindex: number;
  colSpan: number;
  rowindex: number;
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
