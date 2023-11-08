import { Model } from '@/components/core';
import { Instance } from '@t/instance';

export type RowType = 'header' | 'data' | 'group' | 'empty';

export interface RowState {
  type: RowType;
  instance: Instance;
}

export default class RowModel extends Model<RowState> {}
