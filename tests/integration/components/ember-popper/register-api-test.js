import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ember-popper-targeting-parent', 'Integration | Component | registerAPI', {
  integration: true,

  beforeEach() {
    this.set('foundTarget', null);
    this.set('show', false);
  }
});

test('registerAPI returns the explicit target', function(assert) {
  assert.expect(1);

  this.on('registerAPI', ({ popperTarget }) => {
    const expectedTarget = document.getElementById('parent');
    assert.equal(popperTarget, expectedTarget);
  });

  this.render(hbs`
    <div id='parent'>
    </div>

    {{#if show}}
      {{#ember-popper class='popper-element'
                      registerAPI='registerAPI'
                      popperTarget=popperTarget}}
        template block text
      {{/ember-popper}}
    {{/if}}
  `);

  const popperTarget = document.getElementById('parent');
  this.set('popperTarget', popperTarget);
  this.set('show', true);

  return wait();
});

test('when the popper changes the API is reregistered', function(assert) {
  assert.expect(2);

  this.on('registerAPI', () => assert.ok('register API called'));

  this.set('eventsEnabled', true);

  this.render(hbs`
    <div class='parent'>
      {{#ember-popper-targeting-parent class='popper-element'
                      eventsEnabled=eventsEnabled
                      registerAPI='registerAPI'}}
        template block text
      {{/ember-popper-targeting-parent}}
    </div>
  `);

  this.set('eventsEnabled', false);
});

test('when the popper target changes the API reregisters with the new target', function(assert) {
  let foundTarget;

  this.on('registerAPI', ({ popperTarget }) => foundTarget = popperTarget);

  this.render(hbs`
    <div id='initialTarget'>
    </div>

    <div id='newTarget'>
    </div>

    {{#if show}}
      {{#ember-popper class='popper-element' registerAPI='registerAPI' popperTarget=popperTarget}}
        template block text
      {{/ember-popper}}
    {{/if}}
  `);

  const initialTarget = document.getElementById('initialTarget');
  const newTarget = document.getElementById('newTarget');

  this.set('popperTarget', initialTarget);

  this.set('show', true);

  return wait().then(() => {
    assert.equal(foundTarget, initialTarget);

    this.set('popperTarget', newTarget);

    return wait().then(() => {
      assert.equal(foundTarget, newTarget, 'the target changed');
    });
  });
});
