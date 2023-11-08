import { DataObject } from '@t/index';

export interface OptGrid extends Partial<OptCommonColumn> {
  /** Specifies the shortcut key that sets focus on the grid component. */
  accessKey?: string;
  // allowColumnResizing?: boolean;
  // columnMinWidth?: number;
  /** An array of grid columns. */
  columns: OptColumn[];
  // columnWidth?: number | string;
  datas?: DataObject[];
  // dateFormat?: string;
  edit?: undefined; // TODO Experimental
  /** The index of the column that contains the focused data cell. This index is taken from the columns array. */
  focuedColumnIndex?: number;
  /** Specifies the focused data row's index. */
  focusedRowIndex?: number;
  /** Specifies initially or currently focused grid row's key. */
  focusedRowKey?: number;
  /**
   * Specifies the grid component's height.
   */
  height?: string | number;
  /** Specifies the key property that provide key values to access data items. Each key value must be unique.  */
  keyExpr?: string;
  /** Specifies a text string shown when the DataGrid does not display any data. */
  nodata?: string | Element;
  /**
   * Specifies the row compoenet's height (pixel)
   * @description Default: 30, minmum value 20
   */
  rowHeight?: number;
  /** Allows you to select rows or determine which rows are selected.  */
  selectedRowKey?: string[];
  /** Specifies the selection mode. */
  selection?: 'single' | 'multiple';
  /** Specifies the number of the element when the Tab key is used for navigating. */
  tabIndex?: number;
  /** Specifies the grid component's width. */
  width?: string | number;
}

export interface OptCommonColumn {
  /** Specifies whether a user can resize columns. Defaults: true */
  allowColumnResizing: boolean;
  /**
   * Each column's min-width
   * @description the column's width in pixels.
   */
  columnMinWidth?: number;
  /**
   * Each column's width
   * @description [number] The column's width in pixels.
   * @description [string] A CSS-accepted column width measurement (for example, "55px", "80%" and "auto") except relative units such as em, ch, vh, etc.
   */
  columnWidth?: number | string;
  /**
   * Date display format, Defaults: 'YYYY-MM-DD'
   * @see https://day.js.org/docs/en/display/format
   */
  dateFormat: string;
}

export type HorizontalAlign = 'center' | 'left' | 'right';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

export interface OptColumn {
  /** Aligns the content of the column. */
  align?: HorizontalAlign;
  /** Specifies whether a user can edit values in the column at runtime. Default: false */
  allowEditing?: boolean;
  /** Specifies whether data can be filtered by this column. Default: true */
  allowFiltering?: boolean;
  /** Specifies whether the user can group data by values of this column. Default: true */
  allowGrouping?: boolean;
  /** Specifies whether a user can resize the column at runtime. Applies only if allowColumnResizing is true. Default: true */
  allowResizing?: boolean;
  /** In a boolean column, replaces all boolean items with a specified text. */
  booleanText?: { trueText?: string; falseText?: string };
  /** Calculates custom cell values */
  calculateCellValue?: (rowData: DataObject) => any;
  /** Specifies a caption for the column. */
  caption?: string;
  /** Specifies a custom template for data cells. */
  cellTemplate?: Function; // Experimental
  /** Specifies a CSS class */
  className?: string;
  /** An array of grid columns. */
  columns?: OptColumn[];
  /** Binds the column to a field of the source */
  dataField?: string;
  /** Casts column values to a specific data type. */
  dataType?: DataType;
  /** Customizes the text displayed in column cells. */
  displayText?: DisplayText;
  /** Specifies a custom template for group cells */
  groupCellTemplate?: Function; // Experimental
  /** Sets custom column values used to group grid records. */
  groupValue?: string | GroupValueFunction;
  /** Specifies the index of a column when grid records are grouped by the values of this column. */
  groupIndex?: number;
  /** Specifies a custom template for column headers. */
  headerCellTemplate?: Function; // Experimental
  /**
   * Specifies the minimum width of the column.
   * @description the column's width in pixels.
   */
  minWidth?: number;
  /** Specifies a function to be invoked after the user has edited a cell value, but before it is saved in the data source. */
  setCellValue?: SetCellValue;
  /** Vertical aligns the content of the column */
  vertialAlign?: VerticalAlign;
  /** Specifies whether the column is visible, that is, occupies space in the table. */
  visible?: boolean;
  /**
   * Specifies the column's width in pixels or as a percentage. Ignored if it is less than minWidth.
   * @description [number] The column's width in pixels.
   * @description [string] A CSS-accepted column width measurement (for example, "55px", "80%" and "auto") except relative units such as em, ch, vh, etc.
   */
  width?: number | string;
}

export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'progress';
export type DisplayText = (cellInfo: { value: any; valueText: string }) => string;
export type GroupValueFunction = (rowData: DataObject) => any;
export type SetCellValue = (newData: DataObject, value: any, rowData: DataObject) => void;
