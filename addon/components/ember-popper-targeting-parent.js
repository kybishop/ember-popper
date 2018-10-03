import EmberPopperBase from './ember-popper-base';
import layout from '../templates/components/ember-popper-targeting-parent';
import { guidFor } from '@ember/object/internals';

export default EmberPopperBase.extend({
  layout,

  // ================== LIFECYCLE HOOKS ==================

  init() {
    this.id = this.id || `${guidFor(this)}-popper`;
    this._parentFinder = self.document ? self.document.createTextNode('') : '';
    this._super(...arguments);
  },

  didInsertElement() {
    this._initialParentNode = this._parentFinder.parentNode;
    this._super(...arguments);
  },

  /**
   * Used to get the popper target whenever updating the Popper
   */
  _getPopperTarget() {
    return this._initialParentNode;
  }
});
