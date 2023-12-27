import { Instance } from '@t/instance';
import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';

export type DataObject<T = any> = Record<string, T>;
export type OptionOpt = Omit<OptGrid, 'columns'>;

class Grid {
  constructor(element: Element | string, options: OptGrid);

  public element: () => HTMLElement;
  public setData: (datas: DataObject[]) => void;
  public option(): OptGrid;
  public option<K extends keyof OptionOpt>(options: Partial<OptionOpt>): void;
  public option<K extends keyof OptionOpt>(optionName: K): OptionOpt[K];
  public option<K extends keyof OptionOpt>(optionName: K, value: OptionOpt[K]): void;
}

export default Grid;
