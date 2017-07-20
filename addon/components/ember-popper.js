import Ember from 'ember';
import EmberPopperBase from './ember-popper-base';

const { generateGuid } = Ember;

export default class EmberPopper extends EmberPopperBase {

  // ================== LIFECYCLE HOOKS ==================

  init() {
    this.id = this.id || generateGuid();
    this._parentFinder = self.document ? self.document.createTextNode('') : '';

    super.init(...arguments);
  }

  didInsertElement() {
    this._initialParentNode = this._parentFinder.parentNode;

    super.didInsertElement(...arguments);
  }
}
