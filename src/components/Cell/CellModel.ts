import { Model } from '@/components/core';
import { Instance } from '@t/instance';
import { RowController } from '@/components/Row';

export type CellType = 'data' | 'group' | 'header' | 'empty';

export interface CellState {
  type: CellType;
  rowComponent: RowController;
  instance: Instance;
}

export default class CellModel extends Model<CellState> {}
