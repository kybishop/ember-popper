import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('ember-popper', 'Integration | Component | target', {
  integration: true
});

test('undefined target: it targets the parent', function(assert) {
  this.render(hbs`
    <div class='parent' style='position: fixed; bottom: 0; height: 100px; width: 100vw;'>
      {{#ember-popper popperClass='popper-element' placement='top'}}
        template block text
      {{/ember-popper}}
    </div>
  `);

  let parent = document.querySelector('.parent');
  let popper = document.querySelector('.popper-element');

  return wait().then(() => {
    assert.equal(parent.getBoundingClientRect().top,
                 popper.getBoundingClientRect().bottom);

  });
});

test('explicit target: it targets the explicit target', function(assert) {
  this.render(hbs`
    <div class='parent' style='position: fixed; bottom: 0; height: 100px; width: 100vw;'>
    </div>

    {{#ember-popper popperClass='popper-element' placement='top' target='.parent'}}
      template block text
    {{/ember-popper}}
  `);

  let parent = document.querySelector('.parent');
  let popper = document.querySelector('.popper-element');

  return wait().then(() => {
    assert.equal(parent.getBoundingClientRect().top,
                 popper.getBoundingClientRect().bottom);
  });
});

