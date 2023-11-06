import { off, on } from '@/utils/dom';
import { EvtListener } from '@t/html';

/**
 * @template {HTMLElement} T
 */
export default class View<T extends HTMLElement = HTMLElement> {
  private root: string;
  private target: string;
  private $new: Element | null;

  constructor(root: string = '', target: string = '') {
    this.target = target;
    this.$new = null;
    this.root = root;
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
   * Create Virtual DOM
   */
  publish() {
    const $target = this.$target;
    if (!$target) return;
    this.$new = $target.cloneNode(true) as T;
    this.$new.innerHTML = this.template();
  }

  /**
   * Render, replace DOM content to virtual DOM content
   */
  render() {
    if (!this.$new) this.publish();
    if (!this.$new) return;
    this.$target?.replaceWith(this.$new);
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
}
