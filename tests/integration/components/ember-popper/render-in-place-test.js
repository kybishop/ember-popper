import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-popper-targeting-parent', 'Integration | Component | renderInPlace', {
  integration: true
});

test('false: renders in the body', function(assert) {
  this.render(hbs`
    <div>
      {{#ember-popper-targeting-parent class='hello' renderInPlace=false}}
        template block text
      {{/ember-popper-targeting-parent}}
    </div>
  `);

  const popper = document.querySelector('.hello');

  // Sanity check
  assert.equal(popper.innerHTML.trim(), 'template block text');
  assert.ok(popper.hasAttribute('x-placement'));

  assert.equal(popper.parentElement, document.querySelector('.ember-application'));
});

test('false with an explicit popperContainer: renders in the popperContainer', function(assert) {
  this.set('show', false);
  this.render(hbs`
    <div class='poppers-plz'>
    </div>
    {{#if show}}
    <div>
      {{#ember-popper-targeting-parent class='hello' popperContainer='.poppers-plz' renderInPlace=false}}
        template block text
      {{/ember-popper-targeting-parent}}
    </div>
    {{/if}}
  `);
  // ensure the container is in DOM before rendering the popper element
  this.set('show', true);

  const popper = document.querySelector('.hello');

  // Sanity check
  assert.equal(popper.innerHTML.trim(), 'template block text');
  assert.ok(popper.hasAttribute('x-placement'));

  assert.equal(popper.parentElement, document.querySelector('.poppers-plz'));
});

test('true: renders in place', function(assert) {
  this.render(hbs`
    <div class='parent'>
      {{#ember-popper-targeting-parent class='hello' renderInPlace=true}}
        template block text
      {{/ember-popper-targeting-parent}}
    </div>
  `);

  const popper = document.querySelector('.hello');

  // Sanity check
  assert.equal(popper.innerHTML.trim(), 'template block text');
  assert.ok(popper.hasAttribute('x-placement'));

  assert.equal(popper.parentElement, document.querySelector('.parent'));
});
