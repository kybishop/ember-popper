import Ember from 'ember';
import layout from '../templates/components/ember-popper';
import { assert } from '../-debug/helpers';


export default Ember.Component.extend({

  /**
   * ================== PUBLIC CONFIG OPTIONS ==================
   */

  // Options for Popper.js
  options: null,

  // Classes to be applied to the popper element
  popperClass: null,

  // The popper element needs to be moved higher in the DOM tree to avoid z-index issues.
  // See the block-comment in the template for more details.
  popperContainer: document.body,

  // If `true`, the popper element will not be moved to popperContainer. WARNING: This can cause
  // z-index issues where your popper will be overlapped by DOM elements that are nested as deeply
  // in the DOM tree.
  renderInPlace: false,

  // The element the popper will target. If left blank, will be set to the ember-popper's parent.
  target: null,

  /**
   * ================== LIFECYCLE HOOKS ==================
   */

  init() {
    this._super(...arguments);

    if (!this.get('options')) {
      this.options = {};
    }
  },

  didInsertElement() {
    this._super(...arguments);

    this._addPopper();
  },

  willDestroyElement() {
    this._super(...arguments);

    this._popper.destroy();
  },

  /**
   * ================== PRIVATE IMPLEMENTATION DETAILS ==================
   */

  classNameBindings: ['_popperClass'],
  layout,
  isVisible: Ember.computed.alias('renderInPlace'),

  // Set in didInsertElement() once the Popper is initialized.
  // Passed to consumers via a named yield.
  _popper: null,

  // Used to set a classNameBinding on the popper if rendering in place, else we just pass the
  // class to the popper element.
  _popperClass: Ember.computed('renderInPlace', 'popperClass', function() {
    return this.get('renderInPlace') ? this.get('popperClass') : false;
  }),

  // The element to be positioned by the Popper.
  _popperElement: Ember.computed('renderInPlace', function() {
    if (this.get('renderInPlace')) {
      return this.element;
    } else {
      // Our wrapper around yielded elements. See template for details.
      return document.querySelector(`.popper-${this.elementId}`);
    }
  }),

  // Set in didInsertElement() once the Popper is initialized.
  // Passed to consumers via a named yield.
  _popperTarget: null,


  _addPopper() {
    let popperTarget = this._getAndSetPopperTarget();

    this.set('_popper', new Popper(popperTarget,
                                  this.get('_popperElement'),
                                  this.get('options')));
  },

  /**
   * Used to manually set _popperTarget in `didInsertElement()`. Need to wait until
   * `didInsertElement()` to avoid calling `document.querySelectorAll(this.get('target'))`
   * before the target exists.
   */
  _getAndSetPopperTarget() {
    let target = this.get('target');

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

    return this.set('_popperTarget', popperTarget);
  },


  // This will be used to support Ember versions before Glimmer 2.0
  _moveElementToBody() {
    if (this.element.parentNode !== document.body) {
      document.body.appendChild(this.element);
    }
  },

  // This will be used to support Ember versions before Glimmer 2.0
  _destroyElementIfMovedToBody() {
    this.element.parentNode.removeChild(this.element);
  },

  /**
   * These events necessitate a new Popper because either the target, popper element,
   * or options on the Popper must change.
   */
  popperShouldBeReplaced: Ember.observer(
    'options',
    'popperContainer',
    'renderInPlace',
    'target',
    function() {
      this._popper.destroy();

      this._addPopper();
    }
  ),
});
