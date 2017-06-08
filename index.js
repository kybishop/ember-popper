/* eslint-env node */
'use strict';

const StripClassCallCheck = require('babel6-plugin-strip-class-callcheck');
const FilterImports = require('babel-plugin-filter-imports');
const RemoveImports = require('./lib/babel-plugin-remove-imports');
const Funnel = require('broccoli-funnel');
const path = require('path');
const map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-popper',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/popper.js');

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
  },

  treeForVendor: function() {
    var popperTree = new Funnel(path.join(this.project.root, 'node_modules', 'popper.js'), {
      srcDir: 'dist/umd',
      files: ['popper.js', 'popper.js.map']
    });

    popperTree = map(popperTree, function(content) {
      return `if (typeof FastBoot === 'undefined') { ${content} }`;
    });

    return popperTree;
  }
};
