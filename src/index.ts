import IHuiGrid, { DataObject, OptionOpt } from '@t/index';
import { OptGrid } from '@t/options';
import { isString, isUndefined } from '@/utils/common';
import { create$, find$, findAll$ } from './utils/dom';
import observable from './observable';
import { Observable } from '@t/observable';
import { Instance } from '@t/instance';
import createInstance from '@/isntance';
import { cn } from '@/healpers/className';
import { HeaderElement, HeaderView } from '@/components/Header';
import { BodyElement, BodyView } from '@/components/Body';
import { ScrollbarElement, ScrollbarView } from './components/Scrollbar';
import { ColGroupElement, ColGroupView } from './components/ColGroup';

interface ComponentMap {
  Header: HeaderElement;
  Body: BodyElement;
}

class HuiGrid implements IHuiGrid {
  private _element: HTMLElement;
  private _options: Observable<OptGrid>;
  private _instance: Instance;
  private compoentMap: ComponentMap;

  /**
   * @param {Element | string} element Element or Selector
   * @param {OptGrid} options Grid Options
   */
  constructor(element: Element | string, options: OptGrid) {
    // Find parent node
    const parent = isString(element) ? find$(element) : element;
    if (!parent) throw new Error(`Invalid element: ${element}`);

    // Check options
    if (!options) throw new Error(`Options must be required`);
    const opts = observable(options);
    this._options = opts;

    // Create grid base element
    const $element = create$('div', {
      role: 'grid',
      classList: ['hui-grid', 'hui-grid-container'],
      ariaAttr: { label: 'Hui Data Grid' },
    });
    parent.appendChild($element);
    this._element = $element;

    // Create Instance
    const instance = createInstance(opts);
    const { root } = instance;
    $element.classList.add(root);
    this._instance = instance;

    // Render Grid
    const $header = create$('div');
    $element.appendChild($header);
    const Header = new HeaderElement(new HeaderView($header), { instance });

    const $body = create$('div');
    $element.appendChild($body);
    const nodata = observable(() => opts().nodata);
    const Body = new BodyElement(new BodyView($body), { nodata, instance });

    const $colGroups = findAll$(cn('.', 'table', ' colgroup'), $element);
    $colGroups.forEach(($el) => new ColGroupElement(new ColGroupView($el), { instance }));

    new ScrollbarElement(new ScrollbarView(find$(cn('.', 'hscrollbar'), $element) as HTMLElement), {
      position: 'horizontal',
      instance,
    });
    new ScrollbarElement(new ScrollbarView(find$(cn('.', 'vscrollbar'), $element) as HTMLElement), {
      position: 'vertical',
      instance,
    });

    this.compoentMap = { Header, Body };
  }

  /**
   * Get grid HTMLElement
   * @returns {HTMLElement}
   */
  public element() {
    return this._element;
  }

  public setData(datas: DataObject[]) {
    const opts = this._options;
    opts({ ...opts(), datas });
  }

  public option<K extends keyof OptionOpt>(option: K | Partial<OptionOpt>, value?: OptionOpt[K]) {
    const opts = this._options;
    if (isString(option)) {
      if (!isUndefined(value)) opts({ ...opts(), [option]: value });
      else return opts()[option] as OptionOpt[K];
    } else opts({ ...opts(), ...option });
  }
}

export default HuiGrid;
