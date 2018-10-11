import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  fastboot: service(),

  eventsEnabled: true,
  showTargetedPopper: true,

  _popperTarget: computed(function() {
    if (this.get('fastboot.isFastBoot')) {
      return;
    }
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
