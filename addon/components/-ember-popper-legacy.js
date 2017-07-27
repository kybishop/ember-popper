import EmberPopperBase from './ember-popper-base';
import { computed } from 'ember-decorators/object';
import { property } from '../-private/utils/class';

export default class EmberPopper extends EmberPopperBase {

  @property tagName = 'div'

  // ================== LIFECYCLE HOOKS ==================

  didInsertElement() {
    this._initialParentNode = this.element.parentNode;

    super.didInsertElement(...arguments);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    const element = this._getPopperElement();

    if (element.parentNode !== this._initialParentNode) {
      element.parentNode.removeChild(element);
    }
  }

  // ================== PRIVATE IMPLEMENTATION DETAILS ==================

  _updatePopper() {
    const element = this._getPopperElement();
    const renderInPlace = this.get('_renderInPlace');
    const popperContainer = this.get('_popperContainer');

    // If renderInPlace is false, move the element to the popperContainer to avoid z-index issues.
    // See renderInPlace for more details.
    if (renderInPlace === false && element.parentNode !== popperContainer) {
      popperContainer.appendChild(element);
    }

    super._updatePopper();
  }

  _getPopperElement() {
    return this.element;
  }

  @computed()
  _popperHash() {
    return {
      update: this.update.bind(this),
      scheduleUpdate: this.scheduleUpdate.bind(this),
      enableEventListeners: this.enableEventListeners.bind(this),
      disableEventListeners: this.disableEventListeners.bind(this)
    };
  }
}
