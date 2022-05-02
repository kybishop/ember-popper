import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | eventsEnabled', function (hooks) {
  setupRenderingTest(hooks);

  test('sets eventsEnabled in the Popper instance', async function (assert) {
    await render(hbs`
      <div class='parent' style='height: 100px; width: 100%;'>
        <EmberPopperTargetingParent @placement='bottom' class='events-enabled'>
          eventsEnabled test
        </EmberPopperTargetingParent>

        <EmberPopperTargetingParent @eventsEnabled={{false}} @placement='bottom' class='events-disabled'>
          eventsEnabled test
        </EmberPopperTargetingParent>
      </div>
    `);

    const parent = document.querySelector('.parent');
    const eventsEnabledPopper = document.querySelector('.events-enabled');
    const eventsDisabledPopper = document.querySelector('.events-disabled');

    await settled();

    const initialBottomOfParent = parent.getBoundingClientRect().bottom;
    const eventsEnabledInitialPosition =
      eventsEnabledPopper.getBoundingClientRect().top;
    const eventsDisabledInitialPosition =
      eventsDisabledPopper.getBoundingClientRect().top;

    // Sanity check
    assert.equal(
      initialBottomOfParent,
      eventsEnabledInitialPosition,
      'initial eventsEnabled position is correct'
    );
    assert.equal(
      initialBottomOfParent,
      eventsDisabledInitialPosition,
      'initial eventsDisabled position is correct'
    );

    parent.style.height = '200px';

    // Wait for repaint from style change, then trigger scroll
    await settled();
    await triggerEvent(document.querySelector('body'), 'scroll');

    await triggerEvent(document.querySelector('body'), 'scroll');

    // fixes flakiness in this test, not sure why...
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Sanity check
    assert.notEqual(
      initialBottomOfParent,
      parent.getBoundingClientRect().bottom,
      'the parent moved'
    );

    assert.equal(
      eventsEnabledPopper.getBoundingClientRect().top,
      parent.getBoundingClientRect().bottom,
      'events enabled poppers move on scroll'
    );

    assert.equal(
      eventsDisabledPopper.getBoundingClientRect().top,
      eventsDisabledInitialPosition,
      "events not enabled poppers don't move on scroll"
    );
  });
});
