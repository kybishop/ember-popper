import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | target', function(hooks) {
  setupRenderingTest(hooks);

  test('it targets the explicit target', async function(assert) {
    // wait to show the ember-popper until we have set the popperTarget property.
    this.set('show', false);

    await render(hbs`
      <div id="target">
        the target
      </div>

      {{#if show}}
        {{#ember-popper id='attachment' popperTarget=popperTarget}}
          template block text
        {{/ember-popper}}
      {{/if}}
    `);

    const popperTarget = document.getElementById('target');

    this.set('popperTarget', popperTarget);

    // Show the ember-popper-targeted now that we have a target to pass it
    this.set('show', true);

    const popper = document.getElementById('attachment');

    assert.equal(popper.innerHTML.trim(), 'template block text');
    assert.ok(popper.hasAttribute('x-placement'));

    assert.equal(popper.parentElement, document.querySelector('.ember-application'));

    return settled().then(() => {
      assert.equal(popperTarget.getBoundingClientRect().bottom,
                   popper.getBoundingClientRect().top);
    });
  });
});
