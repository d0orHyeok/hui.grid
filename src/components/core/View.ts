import { entries } from '@/utils/common';
import { off, on } from '@/utils/dom';
import { AriaAttributes, AriaRole, CSSProperties, EvtListener } from '@t/html';
import { DataObject } from '@t/index';

/**
 * @template {HTMLElement} T
 */
export default class View<T extends HTMLElement = HTMLElement> {
  #isRender: boolean;
  #selector: string;

  constructor(selector: string) {
    this.#isRender = false;
    this.#selector = selector;
  }

  get selector() {
    return this.#selector;
  }

  get isRender() {
    return this.#isRender;
  }

  /**
   * target element to render
   */
  get $target(): T {
    return document.querySelector(this.selector) as T;
  }

  /**
   * Set element template(innerHTML)
   * @returns {string}
   */
  template() {
    return ``;
  }

  /**
   * Render, replace DOM content to virtual DOM content
   */
  render() {
    const $target = this.$target;
    if (!$target) return;
    const $new = $target.cloneNode(true) as T;
    $new.innerHTML = this.template();
    this.$target?.replaceWith($new);
    this.#isRender = true;
  }

  /**
   * Add event listener
   * @template {keyof HTMLElementEventMap} K
   * @param {K} eventType
   * @param {EvtListener<T, K>} listener
   */
  on<K extends keyof HTMLElementEventMap>(eventType: K, listener: EvtListener<T, K>) {
    const $el = this.$target;
    if ($el) on($el as T, eventType, listener);
  }

  /**
   * Remove event listener
   * @template {keyof HTMLElementEventMap} K
   * @param {K} eventType
   * @param {EvtListener<T, K>} listener
   */
  off<K extends keyof HTMLElementEventMap>(eventType: K, listener: EvtListener<T, K>) {
    const $el = this.$target;
    if ($el) off($el as T, eventType, listener);
  }

  /**
   * Trigger custom event
   * @template O
   * @param {keyof HTMLElementEventMap} eventType
   * @param {O} [data] event detail data
   */
  emit<O>(eventType: keyof HTMLElementEventMap, data?: O) {
    const $el = this.$target;
    if (!$el) return;
    const evt = new CustomEvent<O>(eventType, { detail: data });
    $el.dispatchEvent(evt);
  }

  style(style: CSSProperties) {
    // @ts-ignore
    entries(style, (key, value) => (this.$target.style[key] = value));
  }

  aria(attributes: AriaAttributes) {
    // @ts-ignore
    entries(attributes, (key, value) => (this.$target[key] = value));
  }

  dataset(dataset: DataObject<string>) {
    entries(dataset, (key, value) => (this.$target.dataset[key] = value));
  }

  attr(attr: DataObject<string>, cmd: 'set' | 'remove' = 'set') {
    const command: 'setAttribute' | 'removeAttribute' = `${cmd}Attribute`;
    entries(attr, (key, value) => this.$target[command](key, value));
  }

  role(role: AriaRole) {
    this.$target.role = role;
  }

  /**
   * Hide element
   */
  hide(classList?: string[]) {
    const $el = this.$target;
    if (Array.isArray(classList)) {
      classList.forEach((className) =>
        document.querySelectorAll(className).forEach((el) => el.classList.add('hui-hidden'))
      );
    } else $el.classList.add('hui-hidden');
  }

  /**
   * Show element
   */
  show(classList?: string[]) {
    const $el = this.$target;
    if (!$el) return;
    if (Array.isArray(classList)) {
      classList.forEach((className) =>
        document.querySelectorAll(className).forEach((el) => el.classList.remove('hui-hidden'))
      );
    } else $el.classList.remove('hui-hidden');
  }
}
