import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'ember-popper-targeting-parent',
  'Integration | Component | actions',
  function (hooks) {
    setupRenderingTest(hooks);

    // eslint-disable-next-line qunit/no-hooks-from-ancestor-modules
    hooks.beforeEach(function () {
      this.actions = {};
      this.send = (actionName, ...args) =>
        this.actions[actionName].apply(this, args);
    });

    test('it calls onCreate', async function (assert) {
      assert.expect(2);

      let called = 0;

      this.actions.create = (data) => {
        called++;
        assert.ok(data?.instance, 'onCreate action is called with dataObject');
      };

      await render(hbs`
      <EmberPopperTargetingParent @onCreate={{this.actions.create}}>
        template block text
      </EmberPopperTargetingParent>
    `);

      assert.equal(called, 1, 'onCreate action has been called');
    });

    test('it calls onUpdate', async function (assert) {
      assert.expect(2);

      let called = 0;

      this.actions.update = (data) => {
        called++;
        assert.ok(data?.instance, 'onUpdate action is called with dataObject');
      };

      await render(hbs`
      <EmberPopperTargetingParent @onUpdate={{this.actions.update}}>
        template block text
      </EmberPopperTargetingParent>
    `);

      await triggerEvent(document.querySelector('body'), 'scroll');

      // this seems to fix the previous flakiness in this test, not sure why though...
      await new Promise((resolve) => setTimeout(resolve, 50));

      assert.equal(called, 1, 'onUpdate action has been called after event');
    });
  }
);
