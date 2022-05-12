import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service fastboot;

  @tracked eventsEnabled = true;
  @tracked showTargetedPopper = true;

  get _popperTarget() {
    if (this.fastboot.isFastBoot) {
      return null;
    }
    return document.querySelector('.right');
  }

  @action
  toggleShowTargetedPopper() {
    this.showTargetedPopper = !this.showTargetedPopper;
  }

  @action
  toggleEventsEnabled() {
    this.eventsEnabled = !this.eventsEnabled;
  }
}
