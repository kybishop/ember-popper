import Controller from '@ember/controller';

export default Controller.extend({
  showTargetedPopper: true,

  actions: {
    toggleShowTargetedPopper() {
      this.toggleProperty('showTargetedPopper');
    }
  }
});
