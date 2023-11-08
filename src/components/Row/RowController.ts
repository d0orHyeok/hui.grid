import { Controller } from '@/components/core';
import RowModel from './RowModel';
import RowView from './RowView';

export default class RowController extends Controller<RowModel, RowView> {
  init(): void {
    this.view.setRowType(this.model.state.type);
  }
}
