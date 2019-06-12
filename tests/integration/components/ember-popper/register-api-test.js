import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { render, settled } from '@ember/test-helpers';

module('Integration | Component | registerAPI', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.set('foundTarget', null);
    this.set('show', false);
  });

  test('registerAPI returns the explicit target', async function(assert) {
    assert.expect(1);

    this.actions.registerAPI = ({ popperTarget }) => {
      const expectedTarget = document.getElementById('parent');
      assert.equal(popperTarget, expectedTarget);
    };

    await render(hbs`
      <div id='parent'>
      </div>

      {{#if show}}
        {{#ember-popper class='popper-element'
                        registerAPI=(action 'registerAPI')
                        popperTarget=popperTarget}}
          template block text
        {{/ember-popper}}
      {{/if}}
    `);

    const popperTarget = document.getElementById('parent');
    this.set('popperTarget', popperTarget);
    this.set('show', true);

    return settled();
  });

  test('registerAPI returns the explicit popper element', async function(assert) {
    assert.expect(1);

    this.actions.registerAPI = ({ popperElement }) => {
      const expectedPopperElement = document.querySelector('.popper-element');
      assert.equal(popperElement, expectedPopperElement);
    };

    await render(hbs`
      <div id='parent'>
        {{#ember-popper-targeting-parent class='popper-element'
                        registerAPI=(action 'registerAPI')}}
          template block text
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    return settled();
  });

  test('when the popper changes the API is reregistered', async function(assert) {
    assert.expect(2);

    this.actions.registerAPI = () => assert.ok('register API called');

    this.set('eventsEnabled', true);

    await render(hbs`
      <div class='parent'>
        {{#ember-popper-targeting-parent class='popper-element'
                        eventsEnabled=eventsEnabled
                        registerAPI=(action 'registerAPI')}}
          template block text
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    this.set('eventsEnabled', false);
  });

  test('when the popper target changes the API reregisters with the new target', async function(assert) {
    let foundTarget;

    this.actions.registerAPI = ({ popperTarget }) => foundTarget = popperTarget;

    await render(hbs`
      <div id='initialTarget'>
      </div>

      <div id='newTarget'>
      </div>

      {{#if show}}
        {{#ember-popper class='popper-element'
                        registerAPI=(action 'registerAPI')
                        popperTarget=popperTarget}}
          template block text
        {{/ember-popper}}
      {{/if}}
    `);

    const initialTarget = document.getElementById('initialTarget');
    const newTarget = document.getElementById('newTarget');

    this.set('popperTarget', initialTarget);

    this.set('show', true);

    return settled().then(() => {
      assert.equal(foundTarget, initialTarget);

      this.set('popperTarget', newTarget);

      return settled().then(() => {
        assert.equal(foundTarget, newTarget, 'the target changed');
      });
    });
  });
});
