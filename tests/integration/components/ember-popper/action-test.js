import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('ember-popper-targeting-parent', 'Integration | Component | actions', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it calls onFirstUpdate', async function(assert) {
    assert.expect(2);

    let called = 0;

    this.actions.create = (state) => {
      called++;
      assert.ok(state && state.placement, 'onFirstUpdate action is called with stateObject');
    };

    await render(hbs`
      {{#ember-popper-targeting-parent onFirstUpdate=(action "create")}}
        template block text
      {{/ember-popper-targeting-parent}}
    `);

    assert.equal(called, 1, 'onFirstUpdate action has been called');
  });
});
