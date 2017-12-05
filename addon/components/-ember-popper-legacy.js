import { addObserver, removeObserver } from '@ember/object/observers';

import EmberPopperBase from './ember-popper-base';
import { computed } from 'ember-decorators/object';

import { tagName } from 'ember-decorators/component';

import { GTE_EMBER_1_13 } from 'ember-compatibility-helpers';

@tagName('div')
export default class EmberPopper extends EmberPopperBase {

  // ================== LIFECYCLE HOOKS ==================

  didInsertElement() {
    this._initialParentNode = this.element.parentNode;

    if (!GTE_EMBER_1_13) {
      addObserver(this, 'eventsEnabled', this, this._updatePopper);
      addObserver(this, 'modifiers', this, this._updatePopper);
      addObserver(this, 'onCreate', this, this._updatePopper);
      addObserver(this, 'onUpdate', this, this._updatePopper);
      addObserver(this, 'placement', this, this._updatePopper);
      addObserver(this, 'popperContainer', this, this._updatePopper);
      addObserver(this, 'popperTarget', this, this._updatePopper);
      addObserver(this, 'registerAPI', this, this._updatePopper);
      addObserver(this, 'renderInPlace', this, this._updatePopper);

      super.didRender(...arguments);
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    if (!GTE_EMBER_1_13) {
      removeObserver(this, 'eventsEnabled', this, this._updatePopper);
      removeObserver(this, 'modifiers', this, this._updatePopper);
      removeObserver(this, 'onCreate', this, this._updatePopper);
      removeObserver(this, 'onUpdate', this, this._updatePopper);
      removeObserver(this, 'placement', this, this._updatePopper);
      removeObserver(this, 'popperContainer', this, this._updatePopper);
      removeObserver(this, 'popperTarget', this, this._updatePopper);
      removeObserver(this, 'registerAPI', this, this._updatePopper);
      removeObserver(this, 'renderInPlace', this, this._updatePopper);
    }

    const element = this._getPopperElement();

    if (element.parentNode !== this._initialParentNode) {
      element.parentNode.removeChild(element);
    }
  }

  // ================== PRIVATE IMPLEMENTATION DETAILS ==================

  _updatePopper() {
    const element = this._getPopperElement();
    const popperContainer = this.get('_popperContainer');
    const renderInPlace = this.get('_renderInPlace');

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
  get _popperHash() {
    return {
      disableEventListeners: this.disableEventListeners.bind(this),
      enableEventListeners: this.enableEventListeners.bind(this),
      scheduleUpdate: this.scheduleUpdate.bind(this),
      update: this.update.bind(this)
    };
  }
}
