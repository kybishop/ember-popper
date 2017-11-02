import Controller from '@ember/controller';

export default Controller.extend({
  eventsEnabled: true,
  showTargetedPopper: true,

  actions: {
    toggleShowTargetedPopper() {
      this.toggleProperty('showTargetedPopper');
    },

    toggleEventsEnabled() {
      this.toggleProperty('eventsEnabled');
    }
  }
});
