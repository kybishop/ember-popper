import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { scheduler as raf } from 'ember-raf-scheduler';

export default class EmberPopperBaseComponent extends Component {
  /**
   * Whether event listeners, resize and scroll, for repositioning the popper are initially enabled.
   * @argument({ defaultIfUndefined: true })
   * @type('boolean')
   */
  get eventsEnabled() {
    return this.args.eventsEnabled ?? true;
  }

  /**
   * Whether the Popper element should be hidden. Use this and CSS for `[hidden]` instead of
   * an `{{if}}` if you want to animate the Popper's entry and/or exit.
   * @argument({ defaultIfUndefined: false })
   * @type('boolean')
   */
  get hidden() {
    return this.args.hidden ?? false;
  }

  /**
   * Modifiers that will be merged into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.DEFAULTS
   * @argument
   * @type(optional('object'))
   */
  get modifiers() {
    return this.args.modifiers ?? null;
  }

  /**
   * onCreate callback merged (if present) into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.Defaults.onCreate
   * @argument
   * @type(optional(Function))
   */
  get onCreate() {
    return this.args.onCreate ?? null;
  }

  /**
   * onUpdate callback merged (if present) into the Popper instance's options hash.
   * https://popper.js.org/popper-documentation.html#Popper.Defaults.onUpdate
   * @argument
   * @type(optional(Function))
   */
  get onUpdate() {
    return this.args.onUpdate ?? null;
  }

  /**
   * Placement of the popper. One of ['top', 'right', 'bottom', 'left'].
   * @argument({ defaultIfUndefined: true })
   * @type('string')
   */
  get placement() {
    return this.args.placement ?? 'bottom';
  }

  /**
   * The popper element needs to be moved higher in the DOM tree to avoid z-index issues.
   * See the block-comment in the template for more details. `.ember-application` is applied
   * to the root element of the ember app by default, so we move it up to there.
   * @argument({ defaultIfUndefined: true })
   * @type(Selector)
   */
  get popperContainer() {
    return this.args.popperContainer ?? '.ember-application';
  }

  /**
   * An optional function to be called when a new target is located.
   * The target is passed in as an argument to the function.
   * @argument
   * @type(optional(Action))
   */
  get registerAPI() {
    return this.args.registerAPI ?? null;
  }

  /**
   * If `true`, the popper element will not be moved to popperContainer. WARNING: This can cause
   * z-index issues where your popper will be overlapped by DOM elements that aren't nested as
   * deeply in the DOM tree.
   * @argument({ defaultIfUndefined: true })
   * @type('boolean')
   */
  get renderInPlace() {
    return this.args.renderInPlace ?? false;
  }

  // ================== PRIVATE PROPERTIES ==================

  /**
   * Tracks current/previous state of `_renderInPlace`.
   */
  @tracked _didRenderInPlace = false;

  /**
   * Tracks current/previous value of `eventsEnabled` option
   */
  @tracked _eventsEnabled = null;

  /**
   * Parent of the element on didInsertElement, before it may have been moved
   */
  @tracked _initialParentNode = null;

  /**
   * Tracks current/previous value of `modifiers` option
   */
  @tracked _modifiers = null;

  /**
   * Tracks current/previous value of `onCreate` callback
   */
  @tracked _onCreate = null;

  /**
   * Tracks current/previous value of `onUpdate` callback
   */
  @tracked _onUpdate = null;

  /**
   * Tracks current/previous value of `placement` option
   */
  @tracked _placement = null;

  /**
   * Set in didInsertElement() once the Popper is initialized.
   * Passed to consumers via a named yield.
   */
  @tracked _popper = null;

  /**
   * Tracks popper element
   */
  @tracked _popperElement = null;

  /**
   * Tracks current/previous value of popper target
   */
  @tracked _popperTarget = null;

  /**
   * Public API of the popper sent to external components in `registerAPI`
   */
  @tracked _publicAPI = null;

  /**
   * ID for the requestAnimationFrame used for updates, used to cancel
   * the RAF on component destruction
   */
  @tracked _updateRAF = null;

  willDestroy() {
    if (this._popper !== null) {
      this._popper.destroy();
    }
    raf.forget(this._updateRAF);
    super.willDestroy(...arguments);
  }

  // ================== LIFECYCLE HOOKS ==================

  update() {
    this._popper.update();
  }

  scheduleUpdate() {
    if (this._updateRAF !== null) {
      return;
    }

    this._updateRAF = raf.schedule('affect', () => {
      this._updateRAF = null;
      this._popper.update();
    });
  }

  enableEventListeners() {
    this._popper.enableEventListeners();
  }

  disableEventListeners() {
    this._popper.disableEventListeners();
  }

  /**
   * ================== ACTIONS ==================
   */

  @action
  didInsertPopperElement(element) {
    this._popperElement = element;
    this._updatePopper();
  }

  @action
  willDestroyPopperElement() {
    this._popperElement = null;
  }

  @action
  didUpdatePopperSettings() {
    this._updatePopper();
  }

  // ================== PRIVATE IMPLEMENTATION DETAILS ==================

  _updatePopper() {
    if (this.isDestroying || this.isDestroyed || !this._popperElement) {
      return;
    }

    const { eventsEnabled, placement, modifiers, onCreate, onUpdate } = this;
    const popperTarget = this._getPopperTarget();
    const renderInPlace = this._renderInPlace;

    // Compare against previous values to see if anything has changed
    const didChange =
      renderInPlace !== this._didRenderInPlace ||
      popperTarget !== this._popperTarget ||
      eventsEnabled !== this._eventsEnabled ||
      modifiers !== this._modifiers ||
      placement !== this._placement ||
      onCreate !== this._onCreate ||
      onUpdate !== this._onUpdate;

    if (didChange === true) {
      if (this._popper !== null) {
        this._popper.destroy();
      }

      // Store current values to check against on updates
      this._didRenderInPlace = renderInPlace;
      this._eventsEnabled = eventsEnabled;
      this._modifiers = modifiers;
      this._onCreate = onCreate;
      this._onUpdate = onUpdate;
      this._placement = placement;
      this._popperTarget = popperTarget;

      const options = {
        eventsEnabled,
        modifiers,
        placement,
      };

      if (onCreate) {
        assert(
          'onCreate of ember-popper must be a function',
          typeof onCreate === 'function'
        );
        options.onCreate = onCreate;
      }

      if (onUpdate) {
        assert(
          'onUpdate of ember-popper must be a function',
          typeof onUpdate === 'function'
        );
        options.onUpdate = onUpdate;
      }

      this._popper = new Popper(popperTarget, this._popperElement, options);

      // Execute the registerAPI hook last to ensure the Popper is initialized on the target
      this.args.registerAPI && this.args.registerAPI(this._getPublicAPI());
    }
  }

  _getPopperTarget() {
    return this.popperTarget;
  }

  _getPublicAPI() {
    if (this._publicAPI === null) {
      // bootstrap the public API with fields that are guaranteed to be static,
      // such as imperative actions
      this._publicAPI = {
        disableEventListeners: this.disableEventListeners.bind(this),
        enableEventListeners: this.enableEventListeners.bind(this),
        scheduleUpdate: this.scheduleUpdate.bind(this),
        update: this.update.bind(this),
      };
    }

    this._publicAPI.popperElement = this._popperElement;
    this._publicAPI.popperTarget = this._popperTarget;
    return this._publicAPI;
  }

  get _popperContainer() {
    const renderInPlace = this._renderInPlace;
    const maybeContainer = this.popperContainer;

    let popperContainer;

    if (renderInPlace) {
      popperContainer = this._initialParentNode;
    } else if (maybeContainer instanceof Element) {
      popperContainer = maybeContainer;
    } else if (typeof maybeContainer === 'string') {
      const selector = maybeContainer;
      const possibleContainers = self.document.querySelectorAll(selector);

      assert(
        `ember-popper with popperContainer selector "${selector}" found ` +
          `${possibleContainers.length} possible containers when there should be exactly 1`,
        possibleContainers.length === 1
      );

      popperContainer = possibleContainers[0];
    }

    return popperContainer;
  }

  get _renderInPlace() {
    // self.document is undefined in Fastboot, so we have to render in
    // place for the popper to show up at all.
    return self.document ? !!this.renderInPlace : true;
  }
}
