import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-popper', 'Integration | Component | ember popper', {
  integration: true
});

test('it renders in place', function(assert) {
  assert.expect(2);

  this.render(hbs`{{ember-popper renderInPlace=true}}`);

  assert.equal(this.$().text().trim(), '');

  this.render(hbs`
    {{#ember-popper renderInPlace=true}}
      template block text
    {{/ember-popper}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
