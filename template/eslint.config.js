import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  js.configs.recommended,
    {
    files: ['** /*.ts', '**/*.tsx'
        ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
            },
        },
    plugins: {
      '@typescript-eslint': typescript,
        },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error',
                { args: 'none'
                }
            ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    {
    files: ['**/*.vue'],
    plugins: {
      vue,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'vue/html-indent': ['error', 4],
      'vue/html-closing-bracket-spacing': ['error', { startTag: 'never', endTag: 'never', selfClosingTag: 'never' }],
      'vue/html-closing-bracket-newline': ['error', { singleline: 'never', multiline: 'never' }],
      'vue/html-self-closing': ['error', {
        html: { void: 'never', normal: 'any', component: 'always' },
        svg: 'always',
        math: 'always',
      }],
      'vue/max-attributes-per-line': ['error', { singleline: { max: 4 }, multiline: { max: 1 } }],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
      tailwindcss,
    },
    rules: {
      'prettier/prettier': 'error',
      'tailwindcss/no-custom-classname': 'off',
    },
  },
];