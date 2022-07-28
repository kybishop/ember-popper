import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | modifiers', function(hooks) {
  setupRenderingTest(hooks);

  test('it passes the modifiers to the Popper.js instance', async function(assert) {
    this.set('arrowsEnabledModifier', [{ name: 'arrow', enabled: true }]);
    this.set('arrowsDisabledModifier', [{ name: 'arrow', enabled: false }]);

    await render(hbs`
      <div class='parent'>
        {{#ember-popper-targeting-parent class='arrow-enabled' modifiers=arrowsEnabledModifier}}
          modifiers test
          <div class='popper-arrow' data-popper-arrow></div>
        {{/ember-popper-targeting-parent}}

        {{#ember-popper-targeting-parent class='arrow-disabled' modifiers=arrowsDisabledModifier}}
          modifiers test
          <div class='popper-arrow' data-popper-arrow></div>
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    const arrowEnabledPopper = document.querySelector('.arrow-enabled');
    const arrowDisabledPopper = document.querySelector('.arrow-disabled');

    return settled().then(() => {
      assert.ok(arrowEnabledPopper.querySelector('.popper-arrow').hasAttribute('style'));

      // Note the '!': this popper's arrow div should not receive any styles
      assert.ok(!arrowDisabledPopper.querySelector('.popper-arrow').hasAttribute('style'));
    });
  });

  /**
   *
   *   test('it calls afterWrite', async function(assert) {
   *     assert.expect(2);
   *
   *     let called = 0;
   *
   *     this.actions.update = (state) => {
   *       console.log("UPDATE CALLED", state)
   *       debugger
   *       called++;
   *       assert.ok(state && state.placement, 'afterWrite action is called with dataObject');
   *     };
   *
   *     await render(hbs`
   *       {{#ember-popper-targeting-parent afterWrite=(action "update")}}
   *         template block text
   *       {{/ember-popper-targeting-parent}}
   *     `);
   *
   *     await triggerEvent(document.querySelector('body'), 'scroll');
   *
   *     await settled();
   *     // this seems to fix the previous flakiness in this test, not sure why though...
   *     await new Promise((resolve) => setTimeout(resolve, 50));
   *
   *     assert.equal(called, 1, 'afterWrite action has been called after event');
   *   });
   */
});
