import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('ember-popper', 'Integration | Component | target', {
  integration: true
});

test('it targets the explicit target', function(assert) {
  // wait to show the ember-popper until we have set the popperTarget property.
  this.set('show', false);

  this.render(hbs`
    <div id="target">
      the target
    </div>

    {{#if show}}
      {{#ember-popper id='attachment' popperTarget=popperTarget}}
        template block text
      {{/ember-popper}}
    {{/if}}
  `);

  const popperTarget = document.getElementById('target');

  this.set('popperTarget', popperTarget);

  // Show the ember-popper-targeted now that we have a target to pass it
  this.set('show', true);

  const popper = document.getElementById('attachment');

  assert.equal(popper.innerHTML.trim(), 'template block text');
  assert.ok(popper.hasAttribute('x-placement'));

  assert.equal(popper.parentElement, document.querySelector('.ember-application'));

  return wait().then(() => {
    assert.equal(popperTarget.getBoundingClientRect().bottom,
                 popper.getBoundingClientRect().top);
  });
});
