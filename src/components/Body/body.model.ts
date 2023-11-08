import { Model } from '@/components/core';
import { Source } from '@t/instance/source';
import { Observable } from '@t/observable';

export interface BodyState {
  source: Source;
  nodata: Observable<string | Element | undefined>;
}

export default class BodyModel extends Model<BodyState> {}
