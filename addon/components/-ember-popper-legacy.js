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
      addObserver(this, 'renderInPlace', this, this.didUpdateAttrs);
      addObserver(this, 'eventsEnabled', this, this.didUpdateAttrs);
      addObserver(this, 'modifiers', this, this.didUpdateAttrs);
      addObserver(this, 'registerAPI', this, this.didUpdateAttrs);
      addObserver(this, 'onCreate', this, this.didUpdateAttrs);
      addObserver(this, 'onUpdate', this, this.didUpdateAttrs);
      addObserver(this, 'placement', this, this.didUpdateAttrs);
      addObserver(this, 'popperContainer', this, this.didUpdateAttrs);
      addObserver(this, 'target', this, this.didUpdateAttrs);
    }

    super.didInsertElement(...arguments);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    if (!GTE_EMBER_1_13) {
      removeObserver(this, 'renderInPlace', this, this.didUpdateAttrs);
      removeObserver(this, 'eventsEnabled', this, this.didUpdateAttrs);
      removeObserver(this, 'modifiers', this, this.didUpdateAttrs);
      removeObserver(this, 'registerAPI', this, this.didUpdateAttrs);
      removeObserver(this, 'onCreate', this, this.didUpdateAttrs);
      removeObserver(this, 'onUpdate', this, this.didUpdateAttrs);
      removeObserver(this, 'placement', this, this.didUpdateAttrs);
      removeObserver(this, 'popperContainer', this, this.didUpdateAttrs);
      removeObserver(this, 'target', this, this.didUpdateAttrs);
    }

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
  get _popperHash() {
    return {
      update: this.update.bind(this),
      scheduleUpdate: this.scheduleUpdate.bind(this),
      enableEventListeners: this.enableEventListeners.bind(this),
      disableEventListeners: this.disableEventListeners.bind(this)
    };
  }
}
