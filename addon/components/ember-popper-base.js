import Ember from 'ember';
import { action, computed } from 'ember-decorators/object';

import { assert } from '@ember/debug';

import layout from '../templates/components/ember-popper';
import { property } from '../-private/utils/class';

const { Component } = Ember;

export default class EmberPopperBase extends Component {
  @property layout = layout

  @property tagName = ''

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
   * An optional function to be called when a new target is located.
   * The target is passed in as an argument to the function.
   */
  @property onFoundTarget = null

  /**
   * onCreate callback merged (if present) into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.Defaults.onCreate
   */
  @property onCreate = null

  /**
   * onUpdate callback merged (if present) into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.Defaults.onUpdate
   */
  @property onUpdate = null

  /**
   * Placement of the popper. One of ['top', 'right', 'bottom', 'left'].
   */
  @property placement = 'bottom'

  /**
   * The popper element needs to be moved higher in the DOM tree to avoid z-index issues.
   * See the block-comment in the template for more details. `.ember-application` is applied
   * to the root element of the ember app by default, so we move it up to there.
   */
  @property popperContainer = '.ember-application'

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
   * Parent of the element on didInsertElement, before it may have been moved
   */
  @property _initialParentNode = null

  /**
   * Tracks current/previous state of `_renderInPlace`.
   */
  @property _didRenderInPlace = false

  /**
   * Tracks current/previous value of popper target
   */
  @property _popperTarget = null

  /**
   * Tracks current/previous value of `eventsEnabled` option
   */
  @property _eventsEnabled = null

  /**
   * Tracks current/previous value of `placement` option
   */
  @property _placement = null

  /**
   * Tracks current/previous value of `modifiers` option
   */
  @property _modifiers = null

  /**
   * ID for the requestAnimationFrame used for updates, used to cancel
   * the RAF on component destruction
   */
  @property _updateRAF = null

  /**
   * Tracks current/previous value of `onCreate` callback
   */
  @property _onCreate = null

  /**
   * Tracks current/previous value of `onUpdate` callback
   */
  @property _onUpdate = null

  // ================== LIFECYCLE HOOKS ==================

  didUpdateAttrs() {
    this._updateRAF = requestAnimationFrame(() => {
      this._updatePopper();
    });
  }

  didInsertElement() {
    super.didInsertElement(...arguments);

    this._updatePopper();
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
  scheduleUpdate() {
    this._popper.scheduleUpdate();
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

  _updatePopper() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const popperTarget = this._getPopperTarget();
    const renderInPlace = this.get('_renderInPlace');
    const eventsEnabled = this.get('eventsEnabled');
    const modifiers = this.get('modifiers');
    const placement = this.get('placement');
    const { onCreate, onUpdate } = this;

    const isPopperTargetDifferent = popperTarget !== this._popperTarget;

    // Compare against previous values to see if anything has changed
    const didChange = renderInPlace !== this._didRenderInPlace
      || isPopperTargetDifferent
      || eventsEnabled !== this._eventsEnabled
      || modifiers !== this._modifiers
      || placement !== this._placement
      || onCreate !== this._onCreate
      || onUpdate !== this._onUpdate;

    if (didChange === true) {
      if (this._popper !== null) {
        this._popper.destroy();
      }

      const popperElement = this._getPopperElement();

      // Store current values to check against on updates
      this._didRenderInPlace = renderInPlace;
      this._popperTarget = popperTarget;
      this._eventsEnabled = eventsEnabled;
      this._modifiers = modifiers;
      this._placement = placement;
      this._onCreate = onCreate;
      this._onUpdate = onUpdate;

      const options = {
        eventsEnabled,
        modifiers,
        placement
      };

      if (onCreate) {
        assert('onCreate of ember-popper must be a function', typeof onCreate === 'function');
        options.onCreate = onCreate;
      }

      if (onUpdate) {
        assert('onUpdate of ember-popper must be a function', typeof onUpdate === 'function');
        options.onUpdate = onUpdate;
      }

      this._popper = new Popper(popperTarget, popperElement, options);

      // Execute the onFoundTarget hook last to ensure the Popper is initialized on the target
      if (isPopperTargetDifferent && this.get('onFoundTarget')) {
        this.get('onFoundTarget')(popperTarget);
      }
    }
  }

  /**
   * Used to get the popper element
   */
  _getPopperElement() {
    return self.document.getElementById(this.id);
  }

  /**
   * Used to get the popper target whenever updating the Popper
   */
  _getPopperTarget() {
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

  @computed('_renderInPlace', 'popperContainer')
  _popperContainer() {
    const renderInPlace = this.get('_renderInPlace');
    const maybeContainer = this.get('popperContainer');

    let popperContainer;

    if (renderInPlace) {
      popperContainer = this._initialParentNode;
    } else if (maybeContainer instanceof Element) {
      popperContainer = maybeContainer;
    } else if (typeof maybeContainer === 'string') {
      const selector = maybeContainer;
      const possibleContainers = self.document.querySelectorAll(selector);

      assert(`ember-popper with popperContainer selector "${selector}" found `
             + `${possibleContainers.length} possible containers when there should be exactly 1`,
             possibleContainers.length === 1);

      popperContainer = possibleContainers[0];
    }

    return popperContainer;
  }

  @computed('renderInPlace')
  _renderInPlace() {
    // self.document is undefined in Fastboot, so we have to render in
    // place for the popper to show up at all.
    return self.document ? !!this.get('renderInPlace') : true;
  }
}
