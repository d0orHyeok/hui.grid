import { off, on } from '@/utils/dom';
import { CSSProperties, EvtListener } from '@t/html';

/**
 * @template {HTMLElement} T
 */
export default class View<T extends HTMLElement = HTMLElement> {
  #isRender: boolean;
  private root: string;
  private target: string;

  constructor(root: string = '', target: string = '') {
    this.#isRender = false;
    this.target = target;
    this.root = root;
  }

  get isRender() {
    return this.#isRender;
  }

  /**
   * target element to render
   */
  get $target() {
    return document.querySelector(`${this.root} ${this.target}`) as T;
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
    Object.entries(style).forEach((key, value) => (this.$target.style[key] = value));
  }
}
