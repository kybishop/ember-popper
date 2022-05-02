import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | attributes', function (hooks) {
  setupRenderingTest(hooks);

  test('id is bound correctly', async function (assert) {
    await render(hbs`
      <div class='parent' style='position: fixed; bottom: 0; height: 100px; width: 100%;'>
        <EmberPopperTargetingParent @placement='top' @id='foo'>
          test
        </EmberPopperTargetingParent>
      </div>
    `);

    assert.dom('#foo').exists('id attribute bound correctly');
  });

  test('class is bound correctly', async function (assert) {
    await render(hbs`
      <div class='parent' style='position: fixed; bottom: 0; height: 100px; width: 100%;'>
        <EmberPopperTargetingParent @placement='top' class='foo'>
          test
        </EmberPopperTargetingParent>
      </div>
    `);

    assert.dom('.foo').exists('class attribute bound correctly');
  });

  test('hidden is bound correctly', async function (assert) {
    await render(hbs`
      <div class='parent'>
        <EmberPopperTargetingParent @id='foo' @hidden={{true}}>
          test
        </EmberPopperTargetingParent>
      </div>
    `);

    assert.true(find('#foo').hidden, 'hidden attribute bound correctly');
  });

  test('role is bound correctly', async function (assert) {
    await render(hbs`
      <div class='parent' style='position: fixed; bottom: 0; height: 100px; width: 100%;'>
        <EmberPopperTargetingParent @id='foo' @placement='top' @ariaRole='tooltip'>
          test
        </EmberPopperTargetingParent>
      </div>
    `);

    assert
      .dom('#foo')
      .hasAttribute('role', 'tooltip', 'role attribute bound correctly');
  });

  test('any attributes are supported with angle bracket invocation', async function (assert) {
    await render(hbs`
      <div class='parent' style='position: fixed; bottom: 0; height: 100px; width: 100%;'>
        <EmberPopperTargetingParent @id='foo' @@placement='top' role='tooltip' title="bar" data-test-foo>
          test
        </EmberPopperTargetingParent>
      </div>
    `);

    assert
      .dom('#foo')
      .hasAttribute('role', 'tooltip', 'role attribute bound correctly');
    assert
      .dom('#foo')
      .hasAttribute('title', 'bar', 'title attribute bound correctly');
    assert.dom('#foo').hasAttribute('data-test-foo');
  });
});
