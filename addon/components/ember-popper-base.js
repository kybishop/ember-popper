import Ember from 'ember';
import { action, computed } from 'ember-decorators/object';

import { assert } from '@ember/debug';

import layout from '../templates/components/ember-popper';
import { property } from '../-private/utils/class';

const { Component } = Ember;
export default class EmberPopperBase extends Component {
  @property layout = layout

  // ================== PUBLIC CONFIG OPTIONS ==================

  /**
   * Whether event listeners, resize and scroll, for repositioning the popper are initially enabled.
   */
  @property eventsEnabled = true

  /**
   * Modifiers that will be merged into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.DEFAULTS
   */
  @property modifiers = null

  /**
   * Placement of the popper. One of ['top', 'right', 'bottom', 'left'].
   */
  @property placement = 'bottom'

  /**
   * The popper element needs to be moved higher in the DOM tree to avoid z-index issues.
   * See the block-comment in the template for more details.
   */
  @property popperContainer = null

  /**
   * If `true`, the popper element will not be moved to popperContainer. WARNING: This can cause
   * z-index issues where your popper will be overlapped by DOM elements that aren't nested as
   * deeply in the DOM tree.
   */
  @property renderInPlace = false

  /**
   * The element the popper will target. If left blank, will be set to the ember-popper's parent.
   */
  @property target = null

  // ================== PRIVATE PROPERTIES ==================

  /**
   * Set in didInsertElement() once the Popper is initialized.
   * Passed to consumers via a named yield.
   */
  @property _popper = null

  /**
   * ID for the requestAnimationFrame used for updates, used to cancel
   * the RAF on component destruction
   */
  @property _updateRAF = null

  // ================== LIFECYCLE HOOKS ==================

  didUpdateAttrs() {
    this._popper.destroy();

    this._updateRAF = requestAnimationFrame(() => {
      this._addPopper();
    });
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

    this._addPopper();
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    this._popper.destroy();
    cancelAnimationFrame(this._updateRAF);
  }

  /**
   * ================== ACTIONS ==================
   */

  @action
  update() {
    this._popper.update();
  }

  @action
  enableEventListeners() {
    this._popper.enableEventListeners();
  }

  @action
  disableEventListeners() {
    this._popper.disableEventListeners();
  }

  // ================== PRIVATE IMPLEMENTATION DETAILS ==================

  _addPopper() {
    const target = this.get('_popperTarget');
    const element = this.get('_popperElement');
    const options = this.get('_options');

    this._popper = new Popper(target, element, options);
  }

  /**
   * The element to be positioned by the Popper.
   */
  @computed('_renderInPlace')
  _popperElement() {
    assert('_popperElement must only be used after the component is rendered', !!this.element);

    const renderInPlace = this.get('_renderInPlace');

    // If not rendering in place, return the wrapper around yielded elements. See template for details.
    return renderInPlace ? this.element : document.querySelector(`.popper-${this.elementId}`);
  }

  /**
   * Used to manually set _popperTarget in `didInsertElement()`. Need to wait until
   * `didInsertElement()` to avoid calling `document.querySelectorAll(this.get('target'))`
   * before the target exists.
   */
  @computed('target')
  _popperTarget() {
    const target = this.get('target');

    let popperTarget;

    // If there is no target, set the target to the parent element
    if (!target) {
      popperTarget = this.element.parentNode;
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

  @computed('popperContainer', '_renderInPlace')
  _popperContainer() {
    const renderInPlace = this.get('_renderInPlace');
    const maybeContainer = this.get('popperContainer');

    let popperContainer;

    if (renderInPlace) {
      popperContainer = self.document ? this.element.parentNode : '';
    } else if (maybeContainer instanceof Element) {
      popperContainer = maybeContainer;
    } else if (typeof maybeContainer === 'string') {
      const selector = maybeContainer;
      const possibleContainers = self.document.querySelectorAll(selector);

      assert(`ember-popper with popperContainer selector "${selector}" found `
             + `${possibleContainers.length} possible containers when there should be exactly 1`,
             possibleContainers.length === 1);

      popperContainer = possibleContainers[0];
    } else {
      popperContainer = self.document.body;
    }

    return popperContainer;
  }

  @computed('eventsEnabled', 'modifiers', 'placement')
  _options() {
    const eventsEnabled = this.get('eventsEnabled');
    const modifiers = this.get('modifiers') || {};
    const placement = this.get('placement');

    return { eventsEnabled, modifiers, placement };
  }

  @computed('renderInPlace')
  _renderInPlace() {
    // self.document is undefined in Fastboot, so we have to render in
    // place for the popper to show up at all.
    return self.document ? !!this.get('renderInPlace') : true;
  }
}
