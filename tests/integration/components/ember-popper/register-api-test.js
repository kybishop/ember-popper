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
      {{#ember-popper class='popper-element' registerAPI='registerAPI'}}
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
      {{#ember-popper class='popper-element' registerAPI='registerAPI'}}
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
                    registerAPI='registerAPI'
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
                      registerAPI='registerAPI'}}
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

    {{#ember-popper class='popper-element' registerAPI='registerAPI' popperTarget=target}}
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

test('when shouldRender changes the API reregisters with the newly created popper element', function(assert) {
  let callCount = 0;
  let foundPopperElement;

  this.on('registerAPI', ({ popperElement }) => {
    callCount += 1;
    foundPopperElement = popperElement;
  });
  this.set('shouldRender', false);

  this.render(hbs`
    {{#ember-popper id='popper' registerAPI='registerAPI' shouldRender=shouldRender}}
      template block text
    {{/ember-popper}}
  `);

  assert.equal(callCount, 1, 'registerApi called an unexpected number of times');
  assert.equal(foundPopperElement, null);

  this.set('shouldRender', true);

  return wait().then(() => {
    assert.equal(callCount, 2, 'registerApi should have been called twice');

    const popperElement = document.getElementById('popper');

    // Sanity check
    assert.ok(popperElement);

    assert.equal(foundPopperElement, popperElement);
  });
});
