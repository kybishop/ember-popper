import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render, settled } from '@ember/test-helpers';

module('Integration | Component | sanity check', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it targets the parent', async function(assert) {
    await render(hbs`
      <div id='parent' style='height: 50px; width: 100%;'>
        {{#ember-popper-targeting-parent class='popper-element' placement='bottom'}}
          template block text
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    const parent = document.getElementById('parent');
    const popper = document.querySelector('.popper-element');

    return settled().then(() => {
      assert.equal(parent.getBoundingClientRect().bottom,
                   popper.getBoundingClientRect().top);

    });
  });

  test('it passes ariaRole as role', async function(assert) {
    await this.render(hbs`
      <div id='parent'>
        {{#ember-popper-targeting-parent ariaRole='tooltip' id='popper-element'}}
          The tooltip
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    const tooltip = document.querySelector('#popper-element');
    assert.equal(tooltip.getAttribute('role'), 'tooltip');
  });

  test('it passes hidden', async function(assert) {
    this.set('hidden', false);

    await this.render(hbs`
      <div id='parent'>
        {{#ember-popper-targeting-parent id='popper-element' hidden=hidden}}
          A possibly hidden popper
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    const tooltip = document.querySelector('#popper-element');
    assert.equal(tooltip.hidden, false);
    this.set('hidden', true);
    assert.equal(tooltip.hidden, true);
  });

  test('registerAPI returns the parent', async function(assert) {
    this.actions.registerAPI = ({ popperTarget }) => {
      const parent = document.querySelector('.parent');
      assert.equal(popperTarget, parent);
    };

    await render(hbs`
      <div class='parent'>
        {{#ember-popper-targeting-parent class='popper-element' registerAPI=(action 'registerAPI')}}
          template block text
        {{/ember-popper-targeting-parent}}
      </div>
    `);
  });
});
