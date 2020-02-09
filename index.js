/* eslint-disable ember-suave/prefer-destructuring */
'use strict';

const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: require('./package').name,

  options: {
    nodeAssets: {
      'popper.js': {
        srcDir: 'dist/umd',
        import: {
          include: ['popper.js'],
          processTree(input) {
            return fastbootTransform(input);
          }
        },
        public: ['popper.js.map']
      }
    }
  }
};
