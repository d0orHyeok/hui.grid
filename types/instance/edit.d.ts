import { Observable } from '@t/observable';
import { EditOption } from '@t/options';

export type Edit = {
  options: Observable<EditOption>;
};
