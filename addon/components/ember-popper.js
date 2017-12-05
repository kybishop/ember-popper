import EmberPopperBase from './ember-popper-base';
import { guidFor } from '@ember/object/internals';

export default class EmberPopper extends EmberPopperBase {

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
}
