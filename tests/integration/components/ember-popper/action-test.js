import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerEvent } from 'ember-native-dom-helpers';
import wait from 'ember-test-helpers/wait';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';

if (hasEmberVersion(1, 13)) {
  moduleForComponent('ember-popper-targeting-parent', 'Integration | Component | actions', {
    integration: true
  });

  test('it calls onCreate', function(assert) {
    assert.expect(2);

    let called = 0;
    this.on('create', (data) => {
      called++;
      assert.ok(data && data.instance, 'onCreate action is called with dataObject');
    });

    this.render(hbs`
      {{#ember-popper-targeting-parent onCreate=(action "create")}}
        template block text
      {{/ember-popper-targeting-parent}}
    `);

    return wait()
      .then(() => assert.equal(called, 1, 'onCreate action has been called'));
  });

  test('it calls onUpdate', function(assert) {
    assert.expect(2);

    let called = 0;
    this.on('update', (data) => {
      called++;
      assert.ok(data && data.instance, 'onUpdate action is called with dataObject');
    });

    this.render(hbs`
      {{#ember-popper-targeting-parent onUpdate=(action "update")}}
        template block text
      {{/ember-popper-targeting-parent}}
    `);

    return wait()
      .then(() => triggerEvent(document.querySelector('body'), 'scroll'))
      .then(() => wait())
      .then(() => {
        assert.equal(called, 1, 'onUpdate action has been called after event');
      });
  });
}
