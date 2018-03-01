import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ember-popper', 'Integration | Component | registerAPI', {
  integration: true,

  beforeEach() {
    this.set('foundTarget', null);
  }
});

test('undefined popperTarget: registerAPI returns the popper element', function(assert) {
  this.on('registerAPI', ({ popperElement }) => {
    const parent = document.querySelector('.popper-element');
    assert.equal(popperElement, parent);
  });

  this.render(hbs`
    <div class='parent'>
      {{#ember-popper class='popper-element' registerAPI=(action 'registerAPI')}}
        template block text
      {{/ember-popper}}
    </div>
  `);
});

test('undefined popperTarget: registerAPI returns the parent', function(assert) {
  this.on('registerAPI', ({ popperTarget }) => {
    const parent = document.querySelector('.parent');
    assert.equal(popperTarget, parent);
  });

  this.render(hbs`
    <div class='parent'>
      {{#ember-popper class='popper-element' registerAPI=(action 'registerAPI')}}
        template block text
      {{/ember-popper}}
    </div>
  `);
});

test('explicit popperTarget: registerAPI returns the explicit target', function(assert) {
  this.on('registerAPI', ({ popperTarget }) => {
    const parent = document.querySelector('.parent');
    assert.equal(popperTarget, parent);
  });

  this.render(hbs`
    <div class='parent'>
    </div>

    {{#ember-popper class='popper-element'
                    registerAPI=(action 'registerAPI')
                    popperTarget='.parent'}}
      template block text
    {{/ember-popper}}
  `);
});

test('when the popper changes the API is reregistered', function(assert) {
  assert.expect(2);

  this.on('registerAPI', () => assert.ok('register API called'));

  this.set('eventsEnabled', true);

  this.render(hbs`
    <div class='parent'>
      {{#ember-popper class='popper-element'
                      eventsEnabled=eventsEnabled
                      registerAPI=(action 'registerAPI')}}
        template block text
      {{/ember-popper}}
    </div>
  `);

  this.set('eventsEnabled', false);
});

test('when the popper target changes the API reregisters with the new target', function(assert) {
  let foundTarget;

  this.on('registerAPI', ({ popperTarget }) => foundTarget = popperTarget);

  this.set('target', '.initialTarget');

  this.render(hbs`
    <div class='initialTarget'>
    </div>

    <div class='newTarget'>
    </div>

    {{#ember-popper class='popper-element' registerAPI=(action 'registerAPI') popperTarget=target}}
      template block text
    {{/ember-popper}}
  `);

  const initialTarget = document.querySelector('.initialTarget');

  assert.equal(foundTarget, initialTarget);

  const newTarget = document.querySelector('.newTarget');

  this.set('target', '.newTarget');

  return wait().then(() => {
    assert.equal(foundTarget, newTarget, 'the target changed');
  });
});
