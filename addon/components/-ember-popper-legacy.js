import EmberPopperBase from './ember-popper-base';
import { computed } from 'ember-decorators/object';
import { assert } from '@ember/debug';
import { property } from '../-private/utils/class';

export default class EmberPopper extends EmberPopperBase {

  // ================== PRIVATE PROPERTIES ==================

  /**
   * Tracks the state of the element, if it was moved in the DOM at all
   */
  @property _wasMoved = false

  /**
   * Parent of the element on didInsertElement, before it may have been moved
   */
  @property _initialParentNode = null

  // ================== LIFECYCLE HOOKS ==================

  didInsertElement() {
    // Store the initial parent node
    this._initialParentNode = this.element.parentNode;

    super.didInsertElement(...arguments);
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    if (this._wasMoved) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  // ================== PRIVATE IMPLEMENTATION DETAILS ==================

  _addPopper() {
    const element = this.get('_popperElement');
    const renderInPlace = this.get('_renderInPlace');
    const popperContainer = this.get('_popperContainer');

    // If renderInPlace is false, move the element to the popperContainer to avoid z-index issues.
    // See renderInPlace for more details.
    if (renderInPlace === false && element.parentNode !== popperContainer) {
      popperContainer.appendChild(element);
      this._wasMoved = true;
    }

    super._addPopper();
  }

  @computed()
  _popperElement() {
    assert('_popperElement must only be used after the component is rendered', !!this.element);

    return this.element;
  }

  @computed()
  _popperTarget() {
    const target = this.get('target');

    let popperTarget;

    // If there is no target, set the target to the parent element
    if (!target) {
      popperTarget = this._initialParentNode;
    } else if (target instanceof Element) {
      popperTarget = target;
    } else {
      const nodes = document.querySelectorAll(target);

      assert(`ember-popper with target selector "${target}" found ${nodes.length}`
             + 'possible targets when there should be exactly 1', nodes.length === 1);

      popperTarget = nodes[0];
    }

    return popperTarget;
  }

  @computed()
  _popperHash() {
    return {
      update: this.update.bind(this),
      enableEventListeners: this.enableEventListeners.bind(this),
      disableEventListeners: this.disableEventListeners.bind(this)
    };
  }
}
