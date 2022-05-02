import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modifiers', function (hooks) {
  setupRenderingTest(hooks);

  test('it passes the modifiers to the Popper.js instance', async function (assert) {
    assert.expect(2);
    this.arrowsEnabledModifier = { arrow: { enabled: true } };
    this.arrowsDisabledModifier = { arrow: { enabled: false } };

    await render(hbs`
      <div class='parent'>
        <EmberPopperTargetingParent class='arrow-enabled' @modifiers={{this.arrowsEnabledModifier}}>
          modifiers test
          <div class='popper-arrow' x-arrow></div>
        </EmberPopperTargetingParent>

        <EmberPopperTargetingParent class='arrow-disabled' @modifiers={{this.arrowsDisabledModifier}}>
          modifiers test
          <div class='popper-arrow' x-arrow></div>
        </EmberPopperTargetingParent>
      </div>
    `);

    const arrowEnabledPopper = document.querySelector('.arrow-enabled');
    const arrowDisabledPopper = document.querySelector('.arrow-disabled');

    return settled().then(() => {
      assert.ok(
        arrowEnabledPopper.querySelector('.popper-arrow').hasAttribute('style')
      );

      // Note the '!': this popper's arrow div should not receive any styles
      assert.notOk(
        arrowDisabledPopper.querySelector('.popper-arrow').hasAttribute('style')
      );
    });
  });
});
