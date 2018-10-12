/* eslint-disable ember-suave/prefer-destructuring */
'use strict';

const StripClassCallCheck = require('babel6-plugin-strip-class-callcheck');
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
  },

  included(parent) {
    this._super.included.apply(this, arguments);

    let app = parent;

    while (!app.import) {
      app = app.parent;
    }

    this._setupBabelOptions(app.env);
  },

  _hasSetupBabelOptions: false,
  _setupBabelOptions(env) {
    if (this._hasSetupBabelOptions) {
      return;
    }

    if (/production/.test(env) || /test/.test(env)) {
      // In some versions of Ember, this.options is undefined during tests
      this.options = this.options || {};

      // Make sure the babel options are accessible
      const babelOptions = this.options.babel = this.options.babel || {};
      babelOptions.postTransformPlugins = babelOptions.postTransformPlugins || [];
      babelOptions.postTransformPlugins.push(StripClassCallCheck);
    }

    this._hasSetupBabelOptions = true;
  }
};
