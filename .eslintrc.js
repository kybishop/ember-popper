module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:ember-suave/recommended'
  ],
  env: {
    browser: true
  },
  globals: {
    Popper: false
  },
  rules: {
    'quotes': ['error', 'single', {  'allowTemplateLiterals': true, 'avoidEscape': true }],
    'ember-suave/no-const-outside-module-scope': 0,
    'ember-suave/no-direct-property-access': 1,
    'ember-suave/require-access-in-comments': 0,
    'indent': ['error', 2, {
      "CallExpression": { 'arguments': 'first' },
      'FunctionDeclaration': { 'parameters': 'first' },
      'FunctionExpression': { 'parameters': 'first' }
    }],
    'prefer-const': 2,
  },
  overrides: [
    // node files
    {
      files: [
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'app/**',
        'addon/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
      })
    }
  ]
};
