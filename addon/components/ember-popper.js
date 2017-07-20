import EmberPopperBase from './ember-popper-base';

export default class EmberPopper extends EmberPopperBase {

  // ================== LIFECYCLE HOOKS ==================

  init() {
    this._popperClass = this.get('class');

    super.init(...arguments);
  }

  didInsertElement() {
    if (this.get('_renderInPlace') === false) {
      this.element.className = '';
    }

    super.didInsertElement(...arguments);
  }
}
