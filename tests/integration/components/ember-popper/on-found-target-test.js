import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { moduleForComponent, test } from 'ember-qunit';
import hasEmberVersion from 'ember-test-helpers/has-ember-version';

if (hasEmberVersion(1, 13)) {
  moduleForComponent('ember-popper', 'Integration | Component | onFoundTarget', {
    integration: true,

    beforeEach() {
      this.set('foundTarget', null);
    }
  });

  test('undefined target: onFoundTarget returns the parent', function(assert) {
    this.on('targetCapture', (target) => this.set('foundTarget', target));

    this.render(hbs`
      <div class='parent'>
        {{#ember-popper class='popper-element' onFoundTarget=(action 'targetCapture')}}
          template block text
        {{/ember-popper}}
      </div>
    `);

    const parent = document.querySelector('.parent');

    assert.equal(this.get('foundTarget'), parent);
  });

  test('explicit target: onFoundTarget returns the explicit target', function(assert) {
    this.on('targetCapture', (target) => this.set('foundTarget', target));

    this.render(hbs`
      <div class='parent'>
      </div>

      {{#ember-popper class='popper-element'
                      onFoundTarget=(action 'targetCapture')
                      target='.parent'}}
        template block text
      {{/ember-popper}}
    `);

    const parent = document.querySelector('.parent');

    assert.equal(this.get('foundTarget'), parent);
  });

  test("when the attrs change but the target doesn't: hook isn't triggered", function(assert) {
    this.targetCaptureCount = 0;

    this.on('targetCapture', (target) => {
      this.set('foundTarget', target);
      this.targetCaptureCount++;
    });

    this.set('eventsEnabled', true);

    this.render(hbs`
      <div class='parent'>
        {{#ember-popper class='popper-element'
                        eventsEnabled=eventsEnabled
                        onFoundTarget=(action 'targetCapture')}}
          template block text
        {{/ember-popper}}
      </div>
    `);

    const parent = document.querySelector('.parent');

    assert.equal(this.get('foundTarget'), parent);

    this.set('eventsEnabled', false);

    assert.equal(this.targetCaptureCount, 1, 'onFoundTarget hook only fired once');
  });

  test('when the target changes: it triggers the onFoundTarget hook', function(assert) {
    this.on('targetCapture', (target) => this.set('foundTarget', target));

    this.set('target', '.initialTarget');

    this.render(hbs`
      <div class='initialTarget'>
      </div>

      <div class='newTarget'>
      </div>

      {{#ember-popper class='popper-element' onFoundTarget=(action 'targetCapture') target=target}}
        template block text
      {{/ember-popper}}
    `);

    const initialTarget = document.querySelector('.initialTarget');

    assert.equal(this.get('foundTarget'), initialTarget);

    const newTarget = document.querySelector('.newTarget');

    this.set('target', '.newTarget');

    return wait().then(() => {
      assert.equal(this.get('foundTarget'), newTarget, 'the target changed');
    });
  });
}
