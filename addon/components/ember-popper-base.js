import { assert } from '@ember/debug';

import Component from '@ember/component';

import { action, computed } from 'ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { type, unionOf } from '@ember-decorators/argument/type';
import { tagName } from 'ember-decorators/component';

import { scheduler as raf } from 'ember-raf-scheduler';

import { Element } from '../utils/globals';

import layout from '../templates/components/ember-popper';

@tagName('')
export default class EmberPopperBase extends Component {
  layout = layout

  // ================== PUBLIC CONFIG OPTIONS ==================

  /**
   * Whether event listeners, resize and scroll, for repositioning the popper are initially enabled.
   */
  @argument
  @type('boolean')
  eventsEnabled = true

  /**
   * Modifiers that will be merged into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.DEFAULTS
   */
  @argument
  @type(unionOf(null, 'object'))
  modifiers = null

  /**
   * An optional function to be called when a new target is located.
   * The target is passed in as an argument to the function.
   */
  @argument
  @type(unionOf(null, 'action'))
  registerAPI = null

  /**
   * onCreate callback merged (if present) into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.Defaults.onCreate
   */
  @argument
  @type(unionOf(null, 'function'))
  onCreate = null

  /**
   * onUpdate callback merged (if present) into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.Defaults.onUpdate
   */
  @argument
  @type(unionOf(null, 'function'))
  onUpdate = null

  /**
   * Placement of the popper. One of ['top', 'right', 'bottom', 'left'].
   */
  @argument
  @type('string')
  placement = 'bottom'

  /**
   * The popper element needs to be moved higher in the DOM tree to avoid z-index issues.
   * See the block-comment in the template for more details. `.ember-application` is applied
   * to the root element of the ember app by default, so we move it up to there.
   */
  @argument
  @type(unionOf('string', Element))
  popperContainer = '.ember-application'

  /**
   * If `true`, the popper element will not be moved to popperContainer. WARNING: This can cause
   * z-index issues where your popper will be overlapped by DOM elements that aren't nested as
   * deeply in the DOM tree.
   */
  @argument
  @type('boolean')
  renderInPlace = false

  /**
   * The element the popper will target. If left blank, will be set to the ember-popper's parent.
   */
  @argument
  @type(unionOf(null, 'string', Element))
  target = null

  // ================== PRIVATE PROPERTIES ==================

  /**
   * Set in didInsertElement() once the Popper is initialized.
   * Passed to consumers via a named yield.
   */
  _popper = null

  /**
   * Parent of the element on didInsertElement, before it may have been moved
   */
  _initialParentNode = null

  /**
   * Tracks current/previous state of `_renderInPlace`.
   */
  _didRenderInPlace = false

  /**
   * Tracks current/previous value of popper target
   */
  _popperTarget = null

  /**
   * Tracks current/previous value of `eventsEnabled` option
   */
  _eventsEnabled = null

  /**
   * Tracks current/previous value of `placement` option
   */
  _placement = null

  /**
   * Tracks current/previous value of `modifiers` option
   */
  _modifiers = null

  /**
   * ID for the requestAnimationFrame used for updates, used to cancel
   * the RAF on component destruction
   */
  _updateRAF = null

  /**
   * Tracks current/previous value of `onCreate` callback
   */
  _onCreate = null

  /**
   * Tracks current/previous value of `onUpdate` callback
   */
  _onUpdate = null

  /**
   * Public API of the popper sent to external components in `registerAPI`
   */
  _publicAPI = null

  // ================== LIFECYCLE HOOKS ==================

  didRender() {
    this._updatePopper();
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);

    this._popper.destroy();
    raf.forget(this._updateRAF);
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
    if (this._updateRAF !== null) {
      return;
    }

    this._updateRAF = raf.schedule('affect', () => {
      this._updateRAF = null;
      this._popper.update();
    });
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
    const onCreate = this.get('onCreate');
    const onUpdate = this.get('onUpdate');

    // Compare against previous values to see if anything has changed
    const didChange = renderInPlace !== this._didRenderInPlace
      || popperTarget !== this._popperTarget
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

      // Execute the registerAPI hook last to ensure the Popper is initialized on the target
      if (this.get('registerAPI') !== null) {
        this.sendAction('registerAPI', this._getPublicAPI());
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

  _getPublicAPI() {
    if (this._publicAPI === null) {
      // bootstrap the public API with fields that are guaranteed to be static,
      // such as imperative actions
      this._publicAPI = {
        update: this.update.bind(this),
        scheduleUpdate: this.scheduleUpdate.bind(this),
        enableEventListeners: this.enableEventListeners.bind(this),
        disableEventListeners: this.disableEventListeners.bind(this)
      };
    }

    this._publicAPI.popperElement = this._getPopperElement();
    this._publicAPI.popperTarget = this._popperTarget;

    return this._publicAPI;
  }

  @computed('_renderInPlace', 'popperContainer')
  get _popperContainer() {
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
  get _renderInPlace() {
    // self.document is undefined in Fastboot, so we have to render in
    // place for the popper to show up at all.
    return self.document ? !!this.get('renderInPlace') : true;
  }
}
