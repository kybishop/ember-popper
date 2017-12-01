import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('ember-popper', 'Integration | Component | target', {
  integration: true
});

test('undefined popperTarget: it targets the parent', function(assert) {
  this.render(hbs`
    <div class='parent' style='height: 50px; width: 100%;'>
      {{#ember-popper class='popper-element' placement='bottom'}}
        template block text
      {{/ember-popper}}
    </div>
  `);

  const parent = document.querySelector('.parent');
  const popper = document.querySelector('.popper-element');

  return wait().then(() => {
    assert.equal(parent.getBoundingClientRect().bottom,
                 popper.getBoundingClientRect().top);

  });
});

test('explicit popperTarget: it targets the explicit target', function(assert) {
  this.render(hbs`
    <div class='parent' style='height: 50px; width: 100%;'>
    </div>

    {{#ember-popper class='popper-element' placement='top' popperTarget='.parent'}}
      template block text
    {{/ember-popper}}
  `);

  const parent = document.querySelector('.parent');
  const popper = document.querySelector('.popper-element');

  return wait().then(() => {
    assert.equal(parent.getBoundingClientRect().bottom,
                 popper.getBoundingClientRect().top);
  });
});

