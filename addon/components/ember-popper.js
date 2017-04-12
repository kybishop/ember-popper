import Ember from 'ember';
//import Popper from 'popper.js';

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
    }

    return (target instanceof Element) ? target : document.querySelectorAll(target)[0];
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
