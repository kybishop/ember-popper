import Ember from 'ember';
//import Popper from 'popper.js';

export default Ember.Component.extend({
  options: {},
  target: null,

  didInsertElement() {
    this._super(...arguments);
    this.addPopper();
  },

  willDestroyElement() {
    this._super(...arguments);

    Ember.run.schedule('render', () => {
      this.removeElement(this.element);
      this.removePopper(this._popper);
    });
  },

  addPopper() {
    let popperTarget = this.get('_popperTarget');

    if (this.element) {
      this._popper = new Popper(popperTarget, this.element, this.get('options'));
    }
  },

  _popperTarget: Ember.computed('target', function() {
    let target = this.get('target');

    // If there is no target, set the target to the parent element
    if (!target) {
      return this.element.parentNode;
    }

    // TODO(kjb) decide how to handle selector which returns multiple elements.
    // 1. Error?
    // 2. Popper for each?
    return (target instanceof Element) ? target : document.querySelectorAll(target)[0];
  }),

  popperDidChange: Ember.observer(
    'target',
    'options',
    function() {
      this.removePopper(this._popper);
      this.addPopper();
    }
  ),

  removeElement(element) {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  removePopper(popper) {
    if (popper) {
      popper.destroy();
    }
  },
});
