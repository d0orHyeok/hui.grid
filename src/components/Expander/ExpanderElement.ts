import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import ExpanderView from './ExpanderView';
import { StoreGroupItem } from '@t/instance/source';

export type ExpanderState = DefaultState & {
  data: StoreGroupItem;
};

export default class ExpanderElement extends Component<ExpanderView, ExpanderState> {
  init(): void {
    this.view.$target.classList.add('hui-grid-group-toggle');
    this.bindToggleEvent();
    this.view.setIcon(this.state.data.expanded);
  }

  bindToggleEvent() {
    const { data, instance } = this.state;
    const { store } = instance.source;
    this.view.on('click', (event) => {
      const isExpand = !event.currentTarget.querySelector('i')?.className.includes('expand');
      data.expanded = isExpand;
      store.publish();
    });
  }
}
