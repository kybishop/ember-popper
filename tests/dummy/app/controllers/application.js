import Ember from 'ember';

export default Ember.Controller.extend({
  showTargetedPopper: true,

  actions: {
    toggleShowTargetedPopper() {
      this.toggleProperty('showTargetedPopper');
    }
  }
});
