import Controller from '@/mvc/Controller';
import ScrollbarModel from './scrollbar.model';
import ScrollbarView from './scrollbar.view';

export default class ScrollbarController extends Controller<ScrollbarModel, ScrollbarView> {
  effect(): void {
    this.view.setPosition(this.model.state.position);
  }
}
