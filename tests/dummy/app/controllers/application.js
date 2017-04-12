import Ember from 'ember';

export default Ember.Controller.extend({
  popperOptions: {
    modifiers: {
      flip: {
        behavior: ['left', 'right', 'bottom']
      }
    }
  }
});
