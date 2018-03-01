import EmberPopperBase from './ember-popper-base';
import layout from '../templates/components/ember-popper-targeting-parent';
import { guidFor } from '@ember/object/internals';

export default class EmberPopperTargetingParent extends EmberPopperBase {
  layout = layout

  // ================== LIFECYCLE HOOKS ==================

  init() {
    this.id = this.id || `${guidFor(this)}-popper`;
    this._parentFinder = self.document ? self.document.createTextNode('') : '';

    super.init(...arguments);
  }

  didInsertElement() {
    this._initialParentNode = this._parentFinder.parentNode;

    super.didInsertElement(...arguments);
  }

  /**
   * Used to get the popper target whenever updating the Popper
   */
  _getPopperTarget() {
    return this._initialParentNode;
  }
}
