import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    ignores: ['dist'],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      ...angular.configs.tsRecommended,
    ],
    files: ['**/*.ts'],
    processor: angular.processInlineTemplates,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            ['static-field', 'static-accessor', 'static-method'],
            'constructor',
            'field',
            'accessor',
            'method',
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      curly: 'error',
      'import-x/no-internal-modules': [
        'error',
        {
          allow: [
            '@angular/**',
            'rxjs/**',
            'msw/**',
            'vitest/**',
            '@testing-library/**',
            '**/utils/testing',
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      'import-x/no-internal-modules': 'off',
    },
  },
);
