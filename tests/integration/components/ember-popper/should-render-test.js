import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-popper', 'Integration | Component | shouldRender', {
  integration: true
});

test('false: doesn\'t render the popper element', function(assert) {
  this.render(hbs`
    <div>
      {{#ember-popper class='popper' shouldRender=false}}
        template block text
      {{/ember-popper}}
    </div>
  `);

  const popper = document.querySelector('.hello');

  assert.equal(popper, null);
});

test('true: renders the popper element', function(assert) {
  this.render(hbs`
  <div>
    {{#ember-popper class='popper' shouldRender=true}}
      template block text
    {{/ember-popper}}
  </div>
  `);

  const popper = document.querySelector('.popper');

  assert.equal(popper.innerHTML.trim(), 'template block text');
});

test('toggling: correctly adds a popper instance to the popper element', function(assert) {
  this.set('shouldRender', false);

  this.render(hbs`
    <div>
      {{#ember-popper class='popper' shouldRender=shouldRender}}
        template block text
      {{/ember-popper}}
    </div>
  `);

  assert.equal(document.querySelector('.popper'), null, 'popper is not rendered');

  this.set('shouldRender', true);

  const popper = document.querySelector('.popper');

  assert.equal(popper.innerHTML.trim(), 'template block text');
  assert.ok(popper.hasAttribute('x-placement'));
});