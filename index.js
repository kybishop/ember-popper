/* eslint-env node */
'use strict';

const FilterImports = require('babel-plugin-filter-imports');
const Funnel = require('broccoli-funnel');
const RemoveImports = require('./lib/babel-plugin-remove-imports');
const StripClassCallCheck = require('babel6-plugin-strip-class-callcheck');
const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-popper',

  options: {
    nodeAssets: {
      'popper.js': {
        srcDir: 'dist/umd',
        import: {
          include: ['popper.js'],
          processTree(input) {
            return fastbootTransform(input);
          },
        },
        vendor: ['popper.js.map']
      }
    }
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    this._env = app.env;
    this._setupBabelOptions(app.env);
  },

  _hasSetupBabelOptions: false,
  _setupBabelOptions: function(env) {
    if (this._hasSetupBabelOptions) {
      return;
    }

    if (/production/.test(env) || /test/.test(env)) {
      var strippedImports = {
        'ember-popper/-debug/helpers': [
          'assert',
          'warn',
          'debug',
          'debugOnError',
          'deprecate',
          'stripInProduction'
        ]
      };

      // In some versions of Ember, this.options is undefined during tests
      this.options = this.options || {};

      this.options.babel = {
        plugins: [
          [FilterImports, strippedImports],
          [RemoveImports, 'ember-popper/-debug/helpers']
        ],
        postTransformPlugins: [StripClassCallCheck]
      };
    }

    this._hasSetupBabelOptions = true;
  },

  treeForAddon: function() {
    var tree = this._super.treeForAddon.apply(this, arguments);

    if (/production/.test(this._env) || /test/.test(this._env)) {
      tree = new Funnel(tree, { exclude: [ /-debug/ ] });
    }

    return tree;
  }
};
