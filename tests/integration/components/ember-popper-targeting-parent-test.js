import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ember-popper-targeting-parent', 'Integration | Component | sanity check', {
  integration: true
});

test('it targets the parent', function(assert) {
  this.render(hbs`
    <div id='parent' style='height: 50px; width: 100%;'>
      {{#ember-popper-targeting-parent class='popper-element' placement='bottom'}}
        template block text
      {{/ember-popper-targeting-parent}}
    </div>
  `);

  const parent = document.getElementById('parent');
  const popper = document.querySelector('.popper-element');

  return wait().then(() => {
    assert.equal(parent.getBoundingClientRect().bottom,
                 popper.getBoundingClientRect().top);

  });
});

test('registerAPI returns the parent', function(assert) {
  this.on('registerAPI', ({ popperTarget }) => {
    const parent = document.querySelector('.parent');
    assert.equal(popperTarget, parent);
  });

  this.render(hbs`
    <div class='parent'>
      {{#ember-popper-targeting-parent class='popper-element' registerAPI='registerAPI'}}
        template block text
      {{/ember-popper-targeting-parent}}
    </div>
  `);
});
