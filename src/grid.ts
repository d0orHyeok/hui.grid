import HuiGrid, { DataObject, OptionOpt } from '@t/index';
import { OptGrid } from '@t/options';
import { generateId, isString, isUndefined } from '@/utils/common';
import { createNode } from './utils/dom';
import observable from './observable';
import { Observable } from '@t/observable';
import { Instance } from '@t/instance';
import createInstance from '@/isntance';
import { cn } from '@/data/className';
import { HeaderController, HeaderModel, HeaderView } from './components/Header';

interface ComponentMap {
  Header: HeaderController;
}

class Grid implements HuiGrid {
  private _root: string;
  private _element: HTMLElement;
  private _options: Observable<OptGrid>;
  protected _instance: Instance;
  private compoentMap: ComponentMap;

  /**
   * @param {Element | string} element Element or Selector
   * @param {OptGrid} options Grid Options
   */
  constructor(element: Element | string, options: OptGrid) {
    // Find parent node
    const parent = isString(element) ? document.querySelector(element) : element;
    if (!parent) throw new Error(`Invalid element: ${element}`);

    // Check options
    if (!options) throw new Error(`Options must be required`);
    const opts = observable(options);
    this._options = opts;

    // Create Instance
    const instance = createInstance(opts);
    this._instance = instance;

    // Create grid base element
    this._root = `hui-${generateId()}`;
    const $element = createNode('div', {
      role: 'grid',
      classList: ['hui-grid', 'hui-grid-container', this._root],
      ariaAttr: { label: 'Hui Data Grid' },
    });
    $element.innerHTML = /*html*/ `
      <div class="${cn('header')}" role="presentation"></div>
      <div class="${cn('body')}" role="presentation"></div>
    `;
    parent.appendChild($element);
    this._element = $element;

    // Render Grid
    const rootSelector = `.${this._root}`;
    const Header = new HeaderController(new HeaderModel(), new HeaderView(rootSelector, cn('header', true)));

    this.compoentMap = {
      Header,
    };
  }

  /**
   * Get grid HTMLElement
   * @returns {HTMLElement}
   */
  public element() {
    return this._element;
  }

  public setData(datas: DataObject[]) {
    const source = this._instance.source;
    source.setData(datas);
  }

  public option<K extends keyof OptionOpt>(option: K | Partial<OptionOpt>, value?: OptionOpt[K]) {
    const opts = this._options;
    if (isString(option)) {
      if (!isUndefined(value)) opts({ ...opts(), [option]: value });
      else return opts()[option] as OptionOpt[K];
    } else opts({ ...opts(), ...option });
  }
}

export default Grid;
