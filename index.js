/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-popper',

  options: {
    nodeAssets: {
      'popper.js': {
        srcDir: 'dist',
        import: ['popper.js']
      }
    }
  }
};
