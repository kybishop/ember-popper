import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { triggerEvent } from 'ember-native-dom-helpers';

moduleForComponent('ember-popper', 'Integration | Component | eventsEnabled', {
  integration: true
});

test('sets eventsEnabled in the Popper instance', function(assert) {
  this.render(hbs`
    <div class='parent' style='height: 100px; width: 100%;'>
      {{#ember-popper placement='bottom' class='events-enabled'}}
        eventsEnabled test
      {{/ember-popper}}

      {{#ember-popper eventsEnabled=false placement='bottom' class='events-disabled'}}
        eventsEnabled test
      {{/ember-popper}}
    </div>
  `);

  const parent = document.querySelector('.parent');
  const eventsEnabledPopper = document.querySelector('.events-enabled');
  const eventsDisabledPopper = document.querySelector('.events-disabled');

  return wait().then(() => {
    const initialBottomOfParent = parent.getBoundingClientRect().bottom;
    const eventsEnabledInitialPosition = eventsEnabledPopper.getBoundingClientRect().top;
    const eventsDisabledInitialPosition = eventsDisabledPopper.getBoundingClientRect().top;

    // Sanity check
    assert.equal(initialBottomOfParent,
                 eventsEnabledInitialPosition,
                 'initial eventsEnabled position is correct');
    assert.equal(initialBottomOfParent,
                 eventsDisabledInitialPosition,
                 'initial eventsDisabled position is correct');

    parent.style.height = '200px';

    triggerEvent(document.querySelector('body'), 'scroll');

    return wait().then(() => {
      // Sanity check
      assert.notEqual(initialBottomOfParent, parent.getBoundingClientRect().bottom, 'the parent moved');

      assert.equal(eventsEnabledPopper.getBoundingClientRect().top,
                   parent.getBoundingClientRect().bottom,
                   'events enabled poppers move on scroll');

      assert.equal(eventsDisabledPopper.getBoundingClientRect().top,
                   eventsDisabledInitialPosition,
                   "events not enabled poppers don't move on scroll");
    });
  });
});
