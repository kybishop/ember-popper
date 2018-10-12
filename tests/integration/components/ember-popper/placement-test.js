import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | placement', function(hooks) {
  setupRenderingTest(hooks);

  test('it places the popper appropriately', async function(assert) {
    await render(hbs`
      <div
        style="position: absolute;
               top: 0;
               bottom: 0;
               left: 0;
               right: 0;
               margin: auto;
               width: 1px;
               height: 1px;">
        {{#ember-popper-targeting-parent id='left-plz' placement="left"}}
          template block text
        {{/ember-popper-targeting-parent}}
        {{#ember-popper-targeting-parent id='right-plz' placement="right"}}
          template block text
        {{/ember-popper-targeting-parent}}
        {{#ember-popper-targeting-parent id='top-plz' placement="top"}}
          template block text
        {{/ember-popper-targeting-parent}}
        {{#ember-popper-targeting-parent id='bottom-plz' placement="bottom"}}
          template block text
        {{/ember-popper-targeting-parent}}
      </div>
    `);

    const leftPopper = document.getElementById('left-plz');
    const rightPopper = document.getElementById('right-plz');
    const topPopper = document.getElementById('top-plz');
    const bottomPopper = document.getElementById('bottom-plz');

    assert.equal(leftPopper.getAttribute('x-placement'), 'left');
    assert.equal(rightPopper.getAttribute('x-placement'), 'right');
    assert.equal(topPopper.getAttribute('x-placement'), 'top');
    assert.equal(bottomPopper.getAttribute('x-placement'), 'bottom');
  });
});
