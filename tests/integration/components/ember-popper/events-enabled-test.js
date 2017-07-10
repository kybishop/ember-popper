import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { triggerEvent } from 'ember-native-dom-helpers';


moduleForComponent('ember-popper', 'Integration | Component | eventsEnabled', {
  integration: true
});

test('sets eventsEnabled in the Popper instance', function(assert) {
  this.render(hbs`
    <div class='parent' style='position: fixed; bottom: 0; height: 100px; width: 100vw;'>
      {{#ember-popper placement='top' popperClass='events-enabled'}}
        eventsEnabled test
      {{/ember-popper}}

      {{#ember-popper eventsEnabled=false placement='top' popperClass='events-disabled'}}
        eventsEnabled test
      {{/ember-popper}}
    </div>
  `);

  let parent = document.querySelector('.parent');
  let eventsEnabledPopper = document.querySelector('.events-enabled');
  let eventsDisabledPopper = document.querySelector('.events-disabled');

  return wait().then(() => {
    let initialTopOfParent = parent.getBoundingClientRect().top;
    let eventsEnabledInitialPosition = eventsEnabledPopper.getBoundingClientRect().bottom;
    let eventsDisabledInitialPosition = eventsDisabledPopper.getBoundingClientRect().bottom;

    // Sanity check
    assert.equal(initialTopOfParent,
                 eventsEnabledInitialPosition,
                 'initial eventsEnabled position is correct');
    assert.equal(initialTopOfParent,
                 eventsDisabledInitialPosition,
                 'initial eventsDisabled position is correct');

    parent.style.height = '200px';

    triggerEvent(document.querySelector('body'), 'scroll');

    return wait().then(() => {
      // Sanity check
      assert.notEqual(initialTopOfParent, parent.getBoundingClientRect().top, 'the parent moved');

      assert.equal(eventsEnabledPopper.getBoundingClientRect().bottom,
                   parent.getBoundingClientRect().top,
                   'events enabled poppers move on scroll');

      assert.equal(eventsDisabledPopper.getBoundingClientRect().bottom,
                   eventsDisabledInitialPosition,
                   "events not enabled poppers don't move on scroll");
    });
  });
});
