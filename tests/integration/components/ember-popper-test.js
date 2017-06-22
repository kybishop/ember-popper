import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-popper', 'Integration | Component | ember popper', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    <div>
      {{#ember-popper popperClass="hello"}}
        template block text
      {{/ember-popper}}
    </div>
  `);

  let popper = document.querySelector('.hello');
  assert.equal(popper.innerHTML.trim(), 'template block text');
});
