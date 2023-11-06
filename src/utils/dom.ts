import { AriaAttributes, AriaRole, CSSProperties, EvtListener } from '@t/html';
import { entries, isUndefined } from '@/utils/common';
import { DataObject } from '@t/index';

function convertCamelToDashCase(key: string) {
  const lowerArr = Array.from(key.toLowerCase());
  const arr = Array.from(key);
  return lowerArr.reduce((sum, cur, idx) => {
    const isLower = !idx || cur === arr[idx];
    return sum + (isLower ? cur : `-${cur}`);
  }, '');
}

export function on<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
  $element: T,
  eventType: K,
  listener: EvtListener<T, K>
) {
  // @ts-ignore
  return $element.addEventListener(eventType, listener);
}

export function off<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
  $element: T,
  eventType: K,
  listener: EvtListener<T, K>
) {
  // @ts-ignore
  return $element.removeEventListener(eventType, listener);
}

export function getStyle($element: HTMLElement) {
  return window.getComputedStyle ? window.getComputedStyle($element) : $element.style;
}

export function addEvent<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
  $element: T,
  eventType: K,
  selector: string,
  listener: EvtListener<T, K>,
  condition: (target: Element, currentTarget: Element) => boolean
) {
  const children = [...$element.querySelectorAll(selector)];

  const getTarget = (target: Element) => {
    let $el = target?.closest(selector);
    if (!$el) children.includes(target) ? target : null;
    return $el;
  };
  on($element, eventType, (event) => {
    const $target = getTarget(event.target as Element);
    if (!$target) return false;
    if (typeof condition === 'function' && !condition(event.target as Element, $target)) return false;

    let e = event;
    Object.defineProperty(e, 'currentTarget', {
      value: $target,
      configurable: true,
    });
    // @ts-ignore
    listener(e);
  });
}

const prefixAttr = (obejct: DataObject, prefix: string) => {
  const convert: DataObject = {};
  entries(obejct, (key, value) => {
    if (!isUndefined(value)) convert[`${prefix}-${convertCamelToDashCase(key)}`] = value;
  });
  return convert;
};

export function dataset$(dataset: { [key: string]: string | number | boolean }) {
  let str = '';
  entries(
    dataset,
    (key, value, index) => (str += `${index === 0 ? '' : ' '}${convertCamelToDashCase(key)}="${value}"`)
  );
  return str;
}

export function aria$(ariaAttr: AriaAttributes) {
  let str = '';
  entries(prefixAttr(ariaAttr, 'aria'), (key, value, index) => (str += `${index === 0 ? '' : ' '}${key}="${value}"`));
  return str;
}

export function style$(style: CSSProperties) {
  let str = '';
  entries(style, (key, value, index) => (str += `${index === 0 ? '' : ' '}${convertCamelToDashCase(key)}: ${value};`));
  return str;
}

interface CreateNodeOptions {
  id: string;
  className: string;
  classList: string[];
  role: AriaRole;
  style: CSSProperties;
  dataset: { [key: string]: string | boolean | number };
  ariaAttr: AriaAttributes;
  type: string;
}

export function createNode<K extends keyof HTMLElementTagNameMap>(tagName: K, options: Partial<CreateNodeOptions>) {
  const $el = document.createElement(tagName);
  const { id, className, classList, role, style, dataset, ariaAttr, type } = options;
  if (id) $el.id = id;
  if (className) $el.classList.add(className);
  if (Array.isArray(classList)) $el.classList.add(...classList);
  if (role) $el.role = role;
  // @ts-ignore
  if (type && $el['type']) $el['type'] = type;
  // @ts-ignore
  if (style) entries(style, (key, value) => ($el.style[key] = value));
  if (dataset) entries(dataset, (key, value) => ($el.dataset[key] = `${value}`));
  if (ariaAttr)
    // @ts-ignore
    entries(ariaAttr, (key, value) => ($el[`aria${key.at(0).toUpperCase() + key.substring(1)}`] = `${value}`));
  return $el;
}

/**
 * Control DOM Node's display state
 */
export function toggleShown(element: Element, isShow: boolean, role?: string) {
  if (isShow) {
    element.classList.remove('hui-hidden');
    if (role) element.role = role;
  } else {
    element.classList.add('hui-hidden');
    element.role = 'presentation';
  }
}
