import Model from '@/components/core/Model';
import View from '@/components/core/View';

export default class Controller<M extends Model = Model, V extends View = View> {
  model: M;
  view: V;
  constructor(model: M, view: V) {
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
