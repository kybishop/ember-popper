import Ember from 'ember';
import { assert } from '../-debug/helpers';

export default Ember.Component.extend({
  target: null,

  init() {
    this._super(...arguments);

    if (!this.get('options')) {
      this.options = {};
    }
  },

  didInsertElement() {
    this._super(...arguments);

    this.addPopper();
  },

  willDestroyElement() {
    this._super(...arguments);

    Ember.run.schedule('render', () => {
      this._popper.destroy();
    });
  },

  addPopper() {
    if (this.element) {
      this._popper = new Popper(this.get('_popperTarget'), this.element, this.get('options'));
    }
  },

  _popperTarget: Ember.computed('target', function() {
    let target = this.get('target');

    // If there is no target, set the target to the parent element
    if (!target) {
      return this.element.parentNode;
    } else if (target instanceof Element) {
      return target;
    } else {
      const nodes = document.querySelectorAll(target);

      assert(`ember-popper with target selector "${target}" found ${nodes.length} possible targets when there should be exactly 1`, nodes.length === 1);

      return nodes[0];
    }
  }),

  popperDidChange: Ember.observer(
    'target',
    'options',
    function() {
      this._popper.destroy();

      this.addPopper();
    }
  ),
});
