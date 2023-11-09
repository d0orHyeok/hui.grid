import { cn } from '@/healpers/className';
import { isString } from '@/utils/common';
import { isEqual } from 'lodash-es';
import { DataObject } from '@t/index';
import BodyView from './BodyView';
import { Component } from '@/components/core';
import { DefaultState } from '@t/components';
import { Observable } from '@t/observable';

export interface BodyState extends DefaultState {
  nodata: Observable<string | Element | undefined>;
}

export default class BodyElement extends Component<BodyView, BodyState> {
  init(): void {
    this._syncNodata();
    this._syncData();
  }

  /**
   * Sync option nodata & body nodata
   */
  private _syncNodata() {
    const { nodata } = this.state;
    nodata.subscribe((state) => {
      const $nodata = this.view.$target.querySelector(cn('nodata'));
      if (!state || !$nodata) return;
      if (isString(state)) $nodata.innerHTML = state;
      else ($nodata.innerHTML = ''), $nodata.appendChild(state);
    }, true);
  }

  private _syncData() {
    const { source } = this.state.instance;
    source.store.subscribe((cur, prev) => {
      if (isEqual(cur, prev)) return;
      this.handleChangeDatas(cur);
    }, true);
  }

  handleChangeDatas(datas: DataObject[]) {
    console.log(datas);
  }
}
