import EmberPopperBase from './ember-popper-base';
import { Element } from '@ember-decorators/argument/types';
import { argument } from '@ember-decorators/argument';
import { guidFor } from '@ember/object/internals';
import { type } from '@ember-decorators/argument/type';

export default class EmberPopper extends EmberPopperBase {
  /**
   * The element the popper will target.
   */
  @argument
  @type(Element)
  popperTarget = null

  // ================== LIFECYCLE HOOKS ==================

  init() {
    this.id = this.id || `${guidFor(this)}-popper`;

    super.init(...arguments);
  }
}
