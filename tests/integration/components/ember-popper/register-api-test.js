import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render, settled } from '@ember/test-helpers';

module('Integration | Component | registerAPI', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) =>
      this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function () {
    this.set('foundTarget', null);
    this.set('show', false);
  });

  test('registerAPI returns the explicit target', async function (assert) {
    assert.expect(1);

    this.actions.registerAPI = ({ popperTarget }) => {
      const expectedTarget = document.getElementById('parent');
      assert.equal(popperTarget, expectedTarget);
    };

    await render(hbs`
      <div id='parent'>
      </div>

      {{#if this.show}}
        <EmberPopper
          class='popper-element'
          @registerAPI={{this.actions.registerAPI}}
          @popperTarget={{this.popperTarget}}
        >
          template block text
        </EmberPopper>
      {{/if}}
    `);

    const popperTarget = document.getElementById('parent');
    this.set('popperTarget', popperTarget);
    this.set('show', true);

    return settled();
  });

  test('registerAPI returns the explicit popper element', async function (assert) {
    let registeredPopperElement;

    this.actions.registerAPI = ({ popperElement }) => {
      registeredPopperElement = popperElement;
    };

    await render(hbs`
      <div id='parent'>
        <EmberPopperTargetingParent
          class='popper-element'
          @registerAPI={{this.actions.registerAPI}}
        >
          template block text
        </EmberPopperTargetingParent>
      </div>
    `);

    const expectedPopperElement = document.querySelector('.popper-element');
    assert.ok(
      registeredPopperElement,
      'registerAPI has provided popperElement'
    );
    assert.equal(
      registeredPopperElement,
      expectedPopperElement,
      `popperElement matches expected element`
    );
  });

  test('when the popper changes the API is reregistered', async function (assert) {
    assert.expect(2);

    this.actions.registerAPI = () => assert.ok('register API called');

    this.set('eventsEnabled', true);

    await render(hbs`
      <div class='parent'>
        <EmberPopperTargetingParent
          class='popper-element'
          @eventsEnabled={{this.eventsEnabled}}
          @registerAPI={{this.actions.registerAPI}}
        >
          template block text
        </EmberPopperTargetingParent>
      </div>
    `);

    this.set('eventsEnabled', false);
  });

  test('when the popper target changes the API reregisters with the new target', async function (assert) {
    assert.expect(2);
    let foundTarget;

    this.actions.registerAPI = ({ popperTarget }) =>
      (foundTarget = popperTarget);

    await render(hbs`
      <div id='initialTarget'>
      </div>

      <div id='newTarget'>
      </div>

      {{#if show}}
        <EmberPopper
          class='popper-element'
          @registerAPI={{this.actions.registerAPI}}
          @popperTarget={{this.popperTarget}}
        >
          template block text
        </EmberPopper>
      {{/if}}
    `);

    const initialTarget = document.getElementById('initialTarget');
    const newTarget = document.getElementById('newTarget');

    this.set('popperTarget', initialTarget);

    this.set('show', true);
    await settled();

    return settled().then(() => {
      assert.equal(foundTarget, initialTarget);

      this.set('popperTarget', newTarget);

      return settled().then(() => {
        assert.equal(foundTarget, newTarget, 'the target changed');
      });
    });
  });
});
