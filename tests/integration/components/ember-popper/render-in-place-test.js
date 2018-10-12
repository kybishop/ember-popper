import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | renderInPlace', function(hooks) {
  setupRenderingTest(hooks);

  test('false: renders in the body', async function(assert) {
    await render(hbs`
      <div>
        {{#ember-popper-targeting-parent class='hello' renderInPlace=false}}
          template block text
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    const popper = document.querySelector('.hello');

    // Sanity check
    assert.equal(popper.innerHTML.trim(), 'template block text');
    assert.ok(popper.hasAttribute('x-placement'));

    assert.equal(popper.parentElement, document.querySelector('.ember-application'));
  });

  test('false with an explicit popperContainer: renders in the popperContainer', async function(assert) {
    this.set('show', false);
    await render(hbs`
      <div class='poppers-plz'>
      </div>
      {{#if show}}
      <div>
        {{#ember-popper-targeting-parent class='hello' popperContainer='.poppers-plz' renderInPlace=false}}
          template block text
        {{/ember-popper-targeting-parent}}
      </div>
      {{/if}}
    `);
    // ensure the container is in DOM before rendering the popper element
    this.set('show', true);

    const popper = document.querySelector('.hello');

    // Sanity check
    assert.equal(popper.innerHTML.trim(), 'template block text');
    assert.ok(popper.hasAttribute('x-placement'));

    assert.equal(popper.parentElement, document.querySelector('.poppers-plz'));
  });

  test('true: renders in place', async function(assert) {
    await render(hbs`
      <div class='parent'>
        {{#ember-popper-targeting-parent class='hello' renderInPlace=true}}
          template block text
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    const popper = document.querySelector('.hello');

    // Sanity check
    assert.equal(popper.innerHTML.trim(), 'template block text');
    assert.ok(popper.hasAttribute('x-placement'));

    assert.equal(popper.parentElement, document.querySelector('.parent'));
  });
});
