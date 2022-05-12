import EmberPopperBase from './ember-popper-base';
import { guidFor } from '@ember/object/internals';

export default class EmberPopperComponent extends EmberPopperBase {
  /**
   * The element the popper will target.
   * @argument
   * @type(Element)
   */
  get popperTarget() {
    return this.args.popperTarget ?? null;
  }

  // ================== LIFECYCLE HOOKS ==================

  constructor() {
    super(...arguments);
    this.id = this.args.id || `${guidFor(this)}-popper`;
  }
}
