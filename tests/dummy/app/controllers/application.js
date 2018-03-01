import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  eventsEnabled: true,
  showTargetedPopper: true,

  _popperTarget: computed(function() {
    return document.querySelector('.right');
  }),

  actions: {
    toggleShowTargetedPopper() {
      this.toggleProperty('showTargetedPopper');
    },

    toggleEventsEnabled() {
      this.toggleProperty('eventsEnabled');
    }
  }
});
