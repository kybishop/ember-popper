import Ember from 'ember';
import layout from '../templates/components/ember-popper';
import { assert } from '../-debug/helpers';


export default Ember.Component.extend({

  /**
   * ================== PUBLIC CONFIG OPTIONS ==================
   */

  options: null,
  popperClass: null,
  popperContainer: document.body,
  renderInPlace: false,
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
  isVisible: Ember.computed(function() {
    return this.get('renderInPlace')
  }),

  // set in didInsertElement() once the Popper is initialized. Passed to consumers via  anamed yield
  _popper: null,
  _popperClass: Ember.computed(function() {
    if (this.get('renderInPlace')) {
      return this.get('popperClass');
    } else {
      return false;
    }
  }),
  // set in didInsertElement() once the Popper is initialized. Passed to consumers via  anamed yield
  _popperTarget: null,

  _addPopper() {
    let popperTarget = this.set('_popperTarget', this._getPopperTarget());

    this.set('_popper', new Popper(popperTarget,
                                  this.get('_popperElement'),
                                  this.get('options')));
  },

  /**
   * This is a function so it can be called after elements have been rendered.
   * If set to a computed property, it is called too early b/c of the named yield for popperTarget.
   * In this case, the target might be a selector but the element may not yet exist.
   */
  _getPopperTarget() {
    let target = this.get('target');

    // If there is no target, set the target to the parent element
    if (!target) {
      return this.element.parentNode;
    } else if (target instanceof Element) {
      return target;
    } else {
      const nodes = document.querySelectorAll(target);

      assert(`ember-popper with target selector "${target}" found ${nodes.length}`
             + 'possible targets when there should be exactly 1', nodes.length === 1);

      return nodes[0];
    }
  },

  _popperElement: Ember.computed('renderInPlace', function() {
    if (this.get('renderInPlace')) {
      return this.element;
    } else {
      return document.querySelector(`.popper-${this.elementId}`);
    }
  }),

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

  popperDidChange: Ember.observer(
    'options',
    'target',
    function() {
      this._popper.destroy();

      this._addPopper();
    }
  ),
});
