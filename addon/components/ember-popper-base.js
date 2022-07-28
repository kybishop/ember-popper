import Component from '@ember/component';
import { computed } from '@ember/object';
import { assert } from '@ember/debug';
import layout from '../templates/components/ember-popper';

export default Component.extend({
  layout,

  tagName: '',

  // ================== PUBLIC CONFIG OPTIONS ==================
  /**
   * Whether the Popper element should be hidden. Use this and CSS for `[hidden]` instead of
   * an `{{if}}` if you want to animate the Popper's entry and/or exit.
   * @argument({ defaultIfUndefined: false })
   * @type('boolean')
   */
  hidden: false,

  /**
   * Modifiers that will be merged into the Popper instance's options hash.
   * https://popper.js.org/docs/v2/modifiers
   * @argument
   * @type(optional('object'))
   */
  /* eslint-disable ember/avoid-leaking-state-in-ember-objects */
  modifiers: [],

  /**
   * onFirstUpdate callback merged (if present) into the Popper instance's options hash.
   * https://popper.js.org/docs/v2/lifecycle/#hook-into-the-lifecycle
   * @argument
   * @type(optional(Function))
   */
  onFirstUpdate: null,

  /**
   * Placement of the popper. One of ['auto', 'top', 'right', 'bottom', 'left'].
   * Each placement can have a variation from this list: ['-start', '-end']
   * https://popper.js.org/docs/v2/constructors/#placement
   * @argument({ defaultIfUndefined: true })
   * @type('string')
   */
  placement: 'bottom',

  /**
   * Describes the positioning strategy to use. One of ['absolute', 'fixed']
   * By default, it is absolute, which in the simplest cases does not require repositioning of the popper.
   * https://popper.js.org/docs/v2/constructors/#strategy
   * @argument({ defaultIfUndefined: true })
   * @type('string')
   */
  strategy: 'absolute',

  /**
   * The popper element needs to be moved higher in the DOM tree to avoid z-index issues.
   * See the block-comment in the template for more details. `.ember-application` is applied
   * to the root element of the ember app by default, so we move it up to there.
   * @argument({ defaultIfUndefined: true })
   * @type(Selector)
   */
  popperContainer: '.ember-application',

  /**
   * An optional function to be called when a new target is located.
   * The target is passed in as an argument to the function.
   * @argument
   * @type(optional(Action))
   */
  registerAPI: null,

  /**
   * If `true`, the popper element will not be moved to popperContainer. WARNING: This can cause
   * z-index issues where your popper will be overlapped by DOM elements that aren't nested as
   * deeply in the DOM tree.
   * @argument({ defaultIfUndefined: true })
   * @type('boolean')
   */
  renderInPlace: false,

  // ================== PRIVATE PROPERTIES ==================

  /**
   * Tracks current/previous state of `_renderInPlace`.
   */
  _didRenderInPlace: false,

  /**
   * Parent of the element on didInsertElement, before it may have been moved
   */
  _initialParentNode: null,

  /**
   * Tracks current/previous value of `modifiers` option
   */
  _modifiers: null,

  /**
   * Tracks current/previous value of `onFirstUpdate` callback
   */
  _onFirstUpdate: null,

  /**
   * Tracks current/previous value of `placement` option
   */
  _placement: null,

  /**
   * Tracks current/previous value of `strategy` option
   */
  _strategy: null,

  /**
   * Set in didInsertElement() once the Popper is initialized.
   * Passed to consumers via a named yield.
   */
  _popper: null,

  /**
   * Tracks popper element
   */
  _popperElement: null,

  /**
   * Tracks current/previous value of popper target
   */
  _popperTarget: null,

  /**
   * Public API of the popper sent to external components in `registerAPI`
   */
  _publicAPI: null,

  // ================== LIFECYCLE HOOKS ==================

  willDestroyElement() {
    this._super(...arguments);
    if (this._popper !== null) {
      this._popper.destroy();
    }
  },

  forceUpdate() {
    this._popper.forceUpdate();
  },

  update() {
    return this._popper.update()
  },

  setOptions(options) {
    return this._popper.setOptions(options)
  },

  /**
   * ================== ACTIONS ==================
   */

  actions: {
    update() {
      return this.update();
    },

    forceUpdate() {
      this.forceUpdate();
    },

    didInsertPopperElement(element) {
      this._popperElement = element
      this._updatePopper();
    },

    willDestroyPopperElement() {
      this._popperElement = null
    },

    didUpdatePopperSettings() {
      this._updatePopper()
    }
  },

  // ================== PRIVATE IMPLEMENTATION DETAILS ==================

  _updatePopper() {
    if (this.isDestroying || this.isDestroyed || !this._popperElement) {
      return;
    }

    const modifiers = this.get('modifiers');
    const onFirstUpdate = this.get('onFirstUpdate');
    const placement = this.get('placement');
    const strategy = this.get('strategy');
    const popperTarget = this._getPopperTarget();
    const renderInPlace = this.get('_renderInPlace');

    // Compare against previous values to see if anything has changed
    const didChange = renderInPlace !== this._didRenderInPlace
      || popperTarget !== this._popperTarget
      || modifiers !== this._modifiers
      || placement !== this._placement
      || strategy !== this._strategy
      || onFirstUpdate !== this._onFirstUpdate

    if (didChange === true) {
      if (this._popper !== null) {
        this._popper.destroy();
      }

      // Store current values to check against on updates
      this._didRenderInPlace = renderInPlace;
      this._modifiers = modifiers;
      this._onFirstUpdate = onFirstUpdate;
      this._placement = placement;
      this._strategy = strategy;
      this._popperTarget = popperTarget;

      const options = {
        modifiers,
        placement,
        strategy
      };

      if (onFirstUpdate) {
        assert('onFirstUpdate of ember-popper must be a function', typeof onFirstUpdate === 'function');
        options.onFirstUpdate = onFirstUpdate;
      }

      this._popper = Popper.createPopper(popperTarget, this._popperElement, options);

      // Execute the registerAPI hook last to ensure the Popper is initialized on the target
      if (this.get('registerAPI') !== null) {
        /* eslint-disable ember/closure-actions */
        this.get('registerAPI')(this._getPublicAPI());
      }
    }
  },

  _getPopperTarget() {
    return this.get('popperTarget');
  },

  _getPublicAPI() {
    if (this._publicAPI === null) {
      // bootstrap the public API with fields that are guaranteed to be static,
      // such as imperative actions
      this._publicAPI = {
        forceUpdate: this.forceUpdate.bind(this),
        update: this.update.bind(this),
        setOptions: this.setOptions.bind(this)
      };
    }

    this._publicAPI.popperElement = this._popperElement;
    this._publicAPI.popperTarget = this._popperTarget;

    return this._publicAPI;
  },

  _popperContainer: computed('_renderInPlace', 'popperContainer', function() {
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
  }),

  _renderInPlace: computed('renderInPlace', function() {
    // self.document is undefined in Fastboot, so we have to render in
    // place for the popper to show up at all.
    return self.document ? !!this.get('renderInPlace') : true;
  })
});
