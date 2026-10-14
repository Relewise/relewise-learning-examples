import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js'],
        ignores: ['dist/**', 'node_modules/**'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                setTimeout: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            prettier: prettierPlugin,
        },
        rules: {
            // TypeScript checks variables and names using its own rules.
            'no-undef': 'off',
            'no-unused-vars': 'off',
            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',

            // Prettier
            'prettier/prettier': 'error',
        },
    },
];
