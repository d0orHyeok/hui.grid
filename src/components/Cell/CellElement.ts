import { Component } from '@/components/core';
import CellView from './CellView';
import { DefaultState } from '@t/components';
import { ColumnInfo, GroupColumnInfo } from '@t/instance/column';
import { isBoolean, isFunction, isObjKey, isString, isUndefined } from '@/utils/common';
import { alignMap } from '@/healpers/dataMap';
import { StoreDataItem, StoreGroupItem } from '@t/instance/source';
import { create$ } from '@/utils/dom';

export type CellType = 'data' | 'group';

export type CellState = DefaultState & CellTypedState;

export type CellTypedState =
  | {
      type: 'data';
      columnInfo: ColumnInfo;
      data: StoreDataItem;
    }
  | {
      type: 'group';
      groupColumnInfo: GroupColumnInfo;
      data: StoreGroupItem;
    };

export default class CellElement extends Component<CellView, CellState> {
  init(): void {
    this.renderDataCell();
    this.renderGroupCell();
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

  renderGroupCell() {
    if (this.state.type !== 'group') return;
    const { $target } = this.view;
    this.view.role('gridcell');
    const { data, groupColumnInfo, instance } = this.state;
    const { source } = instance;
    const { booleanText, dataField, dataType, groupCellTemplate, groupValue } = groupColumnInfo;
    const { trueText = 'true', falseText = 'false' } = booleanText ?? {};

    const groupDataItems = source.groupDataMap[JSON.stringify(data.keys)];
    const ItemLength = groupDataItems.length;

    $target.tabIndex = -1;
    const value = isFunction(groupValue) ? groupValue(groupDataItems) : groupDataItems[0].data[groupValue ?? dataField];
    const cellText = dataType === 'boolean' ? (value ? trueText : falseText) : value;

    const $template = create$('div', { className: 'hui-grid-group-cell' });
    if (isFunction(groupCellTemplate)) {
      $template.appendChild(groupCellTemplate({}));
    } else {
      const text = document.createTextNode(cellText);
      const $length = create$('span', { className: 'hui-grid-mark', style: { marginLeft: '4px' } });
      $length.innerHTML = `(${ItemLength})`;
      $template.appendChild(text);
      $template.appendChild($length);
    }

    this.view.setTemplate($template);
  }
}
