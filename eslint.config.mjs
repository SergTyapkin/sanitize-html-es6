import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginTseslint from 'typescript-eslint';
import pluginCompat from 'eslint-plugin-compat';
import pluginNoLoops from 'eslint-plugin-no-loops';
import pluginSonarjs from 'eslint-plugin-sonarjs';
import pluginNoUseExtendNative from 'eslint-plugin-no-use-extend-native';
import pluginOptimizeRegex from 'eslint-plugin-optimize-regex';
import pluginPromise from 'eslint-plugin-promise';
import pluginJest from 'eslint-plugin-jest';
// import pluginImport from 'eslint-plugin-import';
// import pluginImportConfig from 'eslint-plugin-import/config/flat/recommended.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Plugins setup
  pluginJs.configs['recommended'],
  ...pluginTseslint.configs['recommended'],
  pluginCompat.configs['flat/recommended'],
  pluginNoUseExtendNative.configs['recommended'],
  pluginPromise.configs['flat/recommended'],
  pluginJest.configs['flat/recommended'],
  // pluginImportConfig, // Not working with .vue files
  {
    plugins: {
      'optimize-regex': pluginOptimizeRegex,
      sonarjs: pluginSonarjs,
      'no-loops': pluginNoLoops,
      // 'import': pluginImport,
    },
    settings: {
    },
  },

  {
    name: 'Global ignores',
    ignores: ['dist/', 'certbot/', 'coverage/', 'docs/'],
  },

  // Custom setup
  {
    name: 'All es6 code files',
    files: ['src/**/*.{js,mjs,cjs,ts,mts,jsx,tsx,vue}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: pluginTseslint.parser,
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    name: 'Node.js builders files',
    files: ['vite.config.{js,ts,mjs,mts}', 'jsdoc.config.{js,ts,mjs,mts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    name: 'Jest test files',
    files: ['**/*.(test|spec).?(m)(js|ts)?(x)'],
    languageOptions: {
      globals: globals.jest,
    },
  },
];
