import Model from '@/mvc/Model';
import View from '@/mvc/View';

export default class Controller<P extends Object, E extends HTMLElement = HTMLElement> {
  model: Model<P>;
  view: View<E>;
  constructor(model: Model<P>, view: View<E>) {
    this.model = model;
    this.view = view;
    view.render();
    this.effect();
  }

  get isRender() {
    return this.view.isRender;
  }

  get $target() {
    return this.view.$target;
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
    } else $el.classList.add('.hui-hidden');
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
    } else $el.classList.remove('.hui-hidden');
  }

  effect() {}

  render() {
    this.view.render();
  }
}
