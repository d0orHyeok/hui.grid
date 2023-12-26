import { Instance } from '@t/instance';
import { Observable } from '@t/observable';
import { OptGrid } from '@t/options';

export type PublicPart<T> = { [K in keyof T]: T[K] };
export type DataObject<T = any> = Record<string, T>;
export type OptionOpt = Omit<OptGrid, 'columns'>;

declare namespace hui {
  class Grid {
    constructor(element: Element | string, options: OptGrid);

    private render(): () => void;
    public element: () => HTMLElement;
    public setData: (datas: DataObject[]) => void;
    public option(): OptGrid;
    public option<K extends keyof OptionOpt>(options: Partial<OptionOpt>): void;
    public option<K extends keyof OptionOpt>(optionName: K): OptionOpt[K];
    public option<K extends keyof OptionOpt>(optionName: K, value: OptionOpt[K]): void;
  }
}

type HuiGrid = PublicPart<hui.Grid>;
export default HuiGrid;
