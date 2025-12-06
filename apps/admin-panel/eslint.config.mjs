import nx from '@nx/eslint-plugin';
import { defineConfig } from 'eslint/config';
import ngrx from '@ngrx/eslint-plugin/v9';

import baseConfig from '../../eslint.config.mjs';

// Tricky: Remove project service from ngrx config to avoid errors
// Enabling "project" does nothing when "projectService" is enabled.
delete ngrx.configs.all[1].languageOptions.parserOptions.project;

export default defineConfig([
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    extends: [...ngrx.configs.all],
    rules: {
      'no-unused-vars': 'off',
      /** Typescript rules */
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/await-thenable': 'error',
      // Performance optimizations
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Disable expensive rules for better performance
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/return-await': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/sort-keys-in-type-decorator': 'error',
      '@angular-eslint/sort-lifecycle-methods': 'error',
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-signals': 'error',
      /** Perfectionist rules */
      'perfectionist/sort-classes': [
        'error',
        {
          type: 'unsorted',
          groups: [
            'input-properties',
            'output-properties',
            'view-child-properties',
            'view-children-properties',
            'content-child-properties',
            'content-children-properties',
            'host-binding-properties',
            'host-listener-properties',

            'index-signature',
            ['static-property', 'static-accessor-property'],
            ['static-get-method', 'static-set-method'],
            ['protected-static-property', 'protected-static-accessor-property'],
            ['protected-static-get-method', 'protected-static-set-method'],
            ['private-static-property', 'private-static-accessor-property'],
            ['private-static-get-method', 'private-static-set-method'],
            'static-block',

            ['property', 'accessor-property'],
            ['protected-property', 'protected-accessor-property'],
            ['private-property', 'private-accessor-property'],

            'constructor',

            ['get-method', 'set-method'],
            ['protected-get-method', 'protected-set-method'],
            ['private-get-method', 'private-set-method'],

            'angular-lifecycle-onChanges-properties',
            'angular-lifecycle-onInit-properties',
            'angular-lifecycle-onDoCheck-properties',
            'angular-lifecycle-afterContentInit-properties',
            'angular-lifecycle-afterContentChecked-properties',
            'angular-lifecycle-afterViewInit-properties',
            'angular-lifecycle-afterViewChecked-properties',
            'angular-lifecycle-onDestroy-properties',

            ['static-method', 'static-function-property'],
            ['protected-static-method', 'protected-static-function-property'],
            ['private-static-method', 'private-static-function-property'],
            ['method', 'function-property'],
            ['protected-method', 'protected-function-property'],
            ['private-method', 'private-function-property'],
            'unknown',
          ],
          customGroups: [
            {
              groupName: 'input-properties',
              selector: 'property',
              modifiers: ['decorated'],
              decoratorNamePattern: 'Input',
            },
            {
              groupName: 'output-properties',
              selector: 'property',
              modifiers: ['decorated'],
              decoratorNamePattern: 'Output',
            },
            {
              groupName: 'content-child-properties',
              selector: 'property',
              modifiers: ['decorated'],
              decoratorNamePattern: 'ContentChild',
            },
            {
              groupName: 'content-children-properties',
              selector: 'property',
              modifiers: ['decorated'],
              decoratorNamePattern: 'ContentChildren',
            },
            {
              groupName: 'view-child-properties',
              selector: 'property',
              modifiers: ['decorated'],
              decoratorNamePattern: 'ViewChild',
            },
            {
              groupName: 'view-children-properties',
              selector: 'property',
              modifiers: ['decorated'],
              decoratorNamePattern: 'ViewChildren',
            },
            {
              groupName: 'host-binding-properties',
              selector: 'property',
              modifiers: ['decorated'],
              decoratorNamePattern: 'HostBinding',
            },
            {
              groupName: 'host-listener-properties',
              selector: 'property',
              modifiers: ['decorated'],
              decoratorNamePattern: 'HostListener',
            },
            {
              groupName: 'angular-lifecycle-onChanges-properties',
              elementNamePattern: 'ngOnChanges',
            },
            {
              groupName: 'angular-lifecycle-onInit-properties',
              elementNamePattern: 'ngOnInit',
            },
            {
              groupName: 'angular-lifecycle-onDoCheck-properties',
              elementNamePattern: 'ngDoCheck',
            },
            {
              groupName: 'angular-lifecycle-afterContentInit-properties',
              elementNamePattern: 'ngAfterContentInit',
            },
            {
              groupName: 'angular-lifecycle-afterContentChecked-properties',
              elementNamePattern: 'ngAfterContentChecked',
            },
            {
              groupName: 'angular-lifecycle-afterViewInit-properties',
              elementNamePattern: 'ngAfterViewInit',
            },
            {
              groupName: 'angular-lifecycle-afterViewChecked-properties',
              elementNamePattern: 'ngAfterViewChecked',
            },
            {
              groupName: 'angular-lifecycle-onDestroy-properties',
              elementNamePattern: 'ngOnDestroy',
            },
          ],
        },
      ],
      'perfectionist/sort-objects': 'off',
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
]);
