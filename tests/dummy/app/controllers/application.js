import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  showTargetedPopper: true,

  actions: {
    toggleShowTargetedPopper() {
      this.toggleProperty('showTargetedPopper');
    }
  }
});
