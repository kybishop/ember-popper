import EmberPopperBase from './ember-popper-base';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';

export default class EmberPopperTargetingParentComponent extends EmberPopperBase {
  constructor() {
    super(...arguments);
    this.id = this.args.id || `${guidFor(this)}-popper`;
    this._parentFinder = self.document ? self.document.createTextNode('') : '';
  }

  @action
  didInsert(element) {
    this._initialParentNode = this._parentFinder.parentNode;
    this.didInsertPopperElement(element);
  }

  /**
   * Used to get the popper target whenever updating the Popper
   */
  _getPopperTarget() {
    return this._initialParentNode;
  }
}
