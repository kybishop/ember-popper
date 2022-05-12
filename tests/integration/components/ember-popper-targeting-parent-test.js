import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render, settled } from '@ember/test-helpers';

module('Integration | Component | sanity check', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) =>
      this.actions[actionName].apply(this, args);
  });

  test('it targets the parent', async function (assert) {
    assert.expect(1);
    await render(hbs`
      <div id='parent' style='height: 50px; width: 100%;'>
        <EmberPopperTargetingParent class='popper-element' @placement='bottom'>
          template block text
        </EmberPopperTargetingParent>
      </div>
    `);

    const parent = document.getElementById('parent');
    const popper = document.querySelector('.popper-element');

    return settled().then(() => {
      assert.equal(
        parent.getBoundingClientRect().bottom,
        popper.getBoundingClientRect().top
      );
    });
  });

  test('it passes ariaRole as role', async function (assert) {
    await render(hbs`
      <div id='parent'>
        <EmberPopperTargetingParent @ariaRole='tooltip' id='popper-element'>
          The tooltip
        </EmberPopperTargetingParent>
      </div>
    `);

    const tooltip = document.querySelector('#popper-element');
    assert.equal(tooltip.getAttribute('role'), 'tooltip');
  });

  test('it passes hidden', async function (assert) {
    this.set('hidden', false);

    await render(hbs`
      <div id='parent'>
        <EmberPopperTargetingParent @id='popper-element' @hidden={{this.hidden}}>
          A possibly hidden popper
        </EmberPopperTargetingParent>
      </div>
    `);

    const tooltip = document.querySelector('#popper-element');
    assert.false(tooltip.hidden);
    this.set('hidden', true);
    assert.true(tooltip.hidden);
  });

  test('registerAPI returns the parent', async function (assert) {
    assert.expect(1);
    this.actions.registerAPI = ({ popperTarget }) => {
      const parent = document.querySelector('.parent');
      assert.equal(popperTarget, parent);
    };

    await render(hbs`
      <div class='parent'>
        <EmberPopperTargetingParent class='popper-element' @registerAPI={{this.actions.registerAPI}}>
          template block text
        </EmberPopperTargetingParent>
      </div>
    `);
  });
});
