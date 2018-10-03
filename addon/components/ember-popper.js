import EmberPopperBase from './ember-popper-base';
import { guidFor } from '@ember/object/internals';

export default EmberPopperBase.extend({
  /**
   * The element the popper will target.
   * @argument
   * @type(Element)
   */
  popperTarget: null,

  // ================== LIFECYCLE HOOKS ==================

  init() {
    this.id = this.id || `${guidFor(this)}-popper`;
    this._super(...arguments);
  }
});
