import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { triggerEvent } from 'ember-native-dom-helpers';
import wait from 'ember-test-helpers/wait';

moduleForComponent('ember-popper', 'Integration | Component | actions', {
  integration: true
});

test('it calls onCreate', function(assert) {
  assert.expect(2);
  let called = 0;
  const action = (data) => {
    called++;
    assert.ok(data && data.instance, 'onCreate action is called with dataObject');
  };
  this.on('create', action);
  this.render(hbs`
    {{#ember-popper onCreate=(action "create")}}
      template block text
    {{/ember-popper}}
  `);

  return wait()
    .then(() => assert.equal(called, 1, 'onCreate action has been called'));
});

test('it calls onUpdate', function(assert) {
  assert.expect(2);
  let called = 0;
  const action = (data) => {
    called++;
    assert.ok(data && data.instance, 'onUpdate action is called with dataObject');
  };
  this.on('update', action);
  this.render(hbs`
    {{#ember-popper onUpdate=(action "update")}}
      template block text
    {{/ember-popper}}
  `);

  return wait()
    .then(() => triggerEvent(document.querySelector('body'), 'scroll'))
    .then(() => wait())
    .then(() => {
      assert.equal(called, 1, 'onUpdate action has been called after event');
      return wait();
    });
});
