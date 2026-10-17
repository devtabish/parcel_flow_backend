import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['eslint.config.mjs'],
    },

    eslint.configs.recommended,

    ...tseslint.configs.recommendedTypeChecked,

    eslintPluginPrettierRecommended,

    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    {
        rules: {
            curly: ['warn', 'multi-or-nest'],
            'no-useless-catch': 'off',
            'prefer-const': 'warn',
            'no-constant-binary-expression': 'warn',

            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-misused-promises': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'warn',

            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',

            '@typescript-eslint/prefer-promise-reject-errors': 'warn',
            '@typescript-eslint/require-await': 'warn',
            '@typescript-eslint/naming-convention': [
                'warn',
                { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
                { selector: 'class', format: ['PascalCase'] },
                { selector: 'interface', format: ['PascalCase'] },
                { selector: 'typeAlias', format: ['PascalCase'] },
            ],

            'prettier/prettier': [
                'warn',
                {
                    endOfLine: 'auto',
                    singleQuote: true,
                    trailingComma: 'all',
                    bracketSpacing: true,
                    semi: true,
                    tabWidth: 4,
                    printWidth: 150,
                },
            ],
        },
    },
];
