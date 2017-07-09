import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-popper', 'Integration | Component | placement', {
  integration: true
});

test('it places the popper appropriately', function(assert) {
  this.render(hbs`
    <div>
      {{#ember-popper popperClass='left-plz' placement="left"}}
        template block text
      {{/ember-popper}}
      {{#ember-popper popperClass='right-plz' placement="right"}}
        template block text
      {{/ember-popper}}
      {{#ember-popper popperClass='top-plz' placement="top"}}
        template block text
      {{/ember-popper}}
      {{#ember-popper popperClass='bottom-plz' placement="bottom"}}
        template block text
      {{/ember-popper}}
    </div>
  `);

  let leftPopper = document.querySelector('.left-plz');
  let rightPopper = document.querySelector('.right-plz');
  let topPopper = document.querySelector('.top-plz');
  let bottomPopper = document.querySelector('.bottom-plz');

  assert.equal('left', leftPopper.getAttribute('x-placement'));
  assert.equal('right', rightPopper.getAttribute('x-placement'));
  assert.equal('top', topPopper.getAttribute('x-placement'));
  assert.equal('bottom', bottomPopper.getAttribute('x-placement'));
});
