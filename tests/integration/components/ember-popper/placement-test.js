import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-popper-targeting-parent', 'Integration | Component | placement', {
  integration: true
});

test('it places the popper appropriately', function(assert) {
  this.render(hbs`
    <div>
      {{#ember-popper-targeting-parent class='left-plz' placement="left"}}
        template block text
      {{/ember-popper-targeting-parent}}
      {{#ember-popper-targeting-parent class='right-plz' placement="right"}}
        template block text
      {{/ember-popper-targeting-parent}}
      {{#ember-popper-targeting-parent class='top-plz' placement="top"}}
        template block text
      {{/ember-popper-targeting-parent}}
      {{#ember-popper-targeting-parent class='bottom-plz' placement="bottom"}}
        template block text
      {{/ember-popper-targeting-parent}}
    </div>
  `);

  const leftPopper = document.querySelector('.left-plz');
  const rightPopper = document.querySelector('.right-plz');
  const topPopper = document.querySelector('.top-plz');
  const bottomPopper = document.querySelector('.bottom-plz');

  assert.equal('left', leftPopper.getAttribute('x-placement'));
  assert.equal('right', rightPopper.getAttribute('x-placement'));
  assert.equal('top', topPopper.getAttribute('x-placement'));
  assert.equal('bottom', bottomPopper.getAttribute('x-placement'));
});
