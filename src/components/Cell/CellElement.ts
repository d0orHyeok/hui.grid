import { Component } from '@/components/core';
import CellView from './CellView';
import { DefaultState } from '@t/components';
import { ColumnInfo, GroupColumnInfo } from '@t/instance/column';
import { isBoolean, isFunction, isObjKey, isString, isUndefined } from '@/utils/common';
import { alignMap } from '@/healpers/dataMap';
import { SourceData } from '@t/instance/source';

export type CellType = 'data' | 'group';

export type CellState = DefaultState &
  CellTypedState & {
    type: CellType;
  };

export type CellTypedState =
  | {
      type: 'data';
      columnInfo: ColumnInfo;
      data: SourceData;
    }
  | {
      type: 'group';
      groupColumnInfo: GroupColumnInfo;
    };

export default class CellElement extends Component<CellView, CellState> {
  init(): void {
    this.renderDataCell();
  }

  renderDataCell() {
    if (this.state.type !== 'data') return;
    const { $target } = this.view;
    this.view.role('gridcell');
    const { data, columnInfo } = this.state;

    const {
      align,
      allowEditing,
      allowFiltering,
      allowGrouping,
      booleanText,
      calculateCellValue,
      calculateDisplayValue,
      cellTemplate,
      className,
      dataType,
      dataField,
      verticalAlign = 'middle',
    } = columnInfo;

    const { trueText = 'true', falseText = 'false' } = booleanText ?? {};
    if (isString(className)) $target.className = [$target.className, className].join(' ').trim();
    $target.tabIndex = -1;
    const value = data.data[dataField];
    const displayValue = isFunction(calculateDisplayValue) ? calculateDisplayValue(data) : undefined;
    const cellValue = displayValue ?? (isFunction(calculateCellValue) ? calculateCellValue(data) : value);
    const cellText =
      dataType === 'boolean' || (isUndefined(dataType) && isBoolean(cellValue))
        ? cellValue
          ? trueText
          : falseText
        : cellValue ?? '';

    const template = isFunction(cellTemplate)
      ? cellTemplate({
          columnIndex: this.view.columnindex,
          rowIndex: this.view.rowindex,
          columnInfo,
          data,
          displayValue,
          value,
        })
      : cellText;

    this.view.setTemplate(template);

    const dType = dataType ?? typeof value;
    const textAlign = isUndefined(align) ? (isObjKey(dType, alignMap) ? alignMap[dType] : undefined) : align;
    this.view.style({ textAlign, verticalAlign });
  }
}
