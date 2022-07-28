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
});
