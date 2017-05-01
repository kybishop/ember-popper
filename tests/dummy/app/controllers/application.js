import Ember from 'ember';

export default Ember.Controller.extend({
  showTargetedPopper: true,

  popperOptions: {
    modifiers: {
      flip: {
        behavior: ['left', 'right', 'bottom']
      }
    }
  },

  actions: {
    toggleShowTargetedPopper() {
      this.toggleProperty('showTargetedPopper');
    }
  }
});
