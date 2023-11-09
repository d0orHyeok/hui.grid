import { Component } from '@/components/core';
import CellView from './CellView';
import { DefaultState } from '@t/components';

export type CellType = 'data' | 'group' | 'header' | 'empty';

export interface CellState extends DefaultState {
  type: CellType;
}

export default class CellElement extends Component<CellView, CellState> {}
