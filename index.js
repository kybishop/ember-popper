/* eslint-disable ember-suave/prefer-destructuring */
'use strict';

const Funnel = require('broccoli-funnel');
const StripClassCallCheck = require('babel6-plugin-strip-class-callcheck');
const fastbootTransform = require('fastboot-transform');
const VersionChecker = require('ember-cli-version-checker');

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

    const checker = new VersionChecker(app);

    this._emberChecker = checker.forEmber();
    this._env = app.env;
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
  },

  treeForAddon(tree) {
    const _emberChecker = this._emberChecker;

    if (_emberChecker.gte('2.10.0')) {
      tree = new Funnel(tree, {
        exclude: [
          'components/-ember-popper-legacy.js',
          'components/-ember-popper-targeting-parent-legacy.js'
        ]
      });
    } else {
      tree = new Funnel(tree, {
        exclude: [
          'components/ember-popper-targeting-parent.js',
          'components/ember-popper.js'
        ],
        getDestinationPath: replaceLegacyPath
      });
    }

    return this._super.treeForAddon.call(this, tree);
  },

  treeForAddonTemplates(tree) {
    const _emberChecker = this._emberChecker;

    if (_emberChecker.gte('2.10.0')) {
      tree = new Funnel(tree, {
        exclude: [
          'components/-ember-popper-legacy-1.11.hbs',
          'components/-ember-popper-legacy.hbs'
        ]
      });
    } else if (_emberChecker.gte('1.13.0')) {
      tree = new Funnel(tree, {
        exclude: [
          'components/-ember-popper-legacy-1.11.hbs',
          'components/ember-popper-targeting-parent.hbs',
          'components/ember-popper.hbs'
        ],
        getDestinationPath: replaceLegacyPath
      });
    } else {
      tree = new Funnel(tree, {
        exclude: [
          'components/-ember-popper-legacy.hbs',
          'components/ember-popper-targeting-parent.hbs',
          'components/ember-popper.hbs'
        ],
        getDestinationPath: replaceLegacyPath
      });
    }

    return this._super.treeForAddonTemplates.call(this, tree);
  },

  treeForApp(tree) {
    if (this._emberChecker.lt('2.10.0')) {
      tree = new Funnel(tree, {
        exclude: [
          'templates/components/ember-popper-targeting-parent.js'
        ]
      });
    }

    return this._super.treeForApp.call(this, tree);
  },

  treeForTemplates(tree) {
    if (this._emberChecker.lt('2.10.0')) {
      tree = new Funnel(tree, {
        exclude: [
          'components/ember-popper-targeting-parent.js'
        ]
      });
    }

    return this._super.treeForTemplates.call(this, tree);
  }
};

function replaceLegacyPath(relativePath) {
  return relativePath
    .replace(/-ember-popper-legacy(-1.11)?/g, 'ember-popper')
    .replace(/-ember-popper-targeting-parent-legacy/g, 'ember-popper-targeting-parent');
}
