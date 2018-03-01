import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('ember-popper-targeting-parent', 'Integration | Component | modifiers', {
  integration: true
});

test('it passes the modifiers to the Popper.js instance', function(assert) {
  this.set('arrowsEnabledModifier', { arrow: { enabled: true } });
  this.set('arrowsDisabledModifier', { arrow: { enabled: false } });

  this.render(hbs`
    <div class='parent'>
      {{#ember-popper-targeting-parent class='arrow-enabled' modifiers=arrowsEnabledModifier}}
        modifiers test
        <div class='popper-arrow' x-arrow></div>
      {{/ember-popper-targeting-parent}}

      {{#ember-popper-targeting-parent class='arrow-disabled' modifiers=arrowsDisabledModifier}}
        modifiers test
        <div class='popper-arrow' x-arrow></div>
      {{/ember-popper-targeting-parent}}
    </div>
  `);

  const arrowEnabledPopper = document.querySelector('.arrow-enabled');
  const arrowDisabledPopper = document.querySelector('.arrow-disabled');

  return wait().then(() => {
    assert.ok(arrowEnabledPopper.querySelector('.popper-arrow').hasAttribute('style'));

    // Note the '!': this popper's arrow div should not receive any styles
    assert.ok(!arrowDisabledPopper.querySelector('.popper-arrow').hasAttribute('style'));
  });
});
