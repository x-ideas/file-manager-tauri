import js from '@eslint/js';
import * as tsParser from '@typescript-eslint/parser';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import * as importX from 'eslint-plugin-import-x';
import { createNodeResolver } from 'eslint-plugin-import-x';
import oxlint from 'eslint-plugin-oxlint';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
	js.configs.recommended,
	...tsConfigs.recommended,
	prettier,

	// import
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	{
		files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			'import-x/no-deprecated': ['error'],
			'import-x/no-duplicates': ['error'],
			'import-x/no-extraneous-dependencies': [
				'error',
				{
					// non src folder can import devDependencies
					devDependencies: ['!**/src/**'],
					whitelist: ['vitest'],
				},
			],
			'import-x/no-cycle': [
				'error',
				{
					ignoreExternal: true,
				},
			],
			'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
			// 'import-x/extensions': ['error', 'ignorePackages'],
			'import-x/order': [
				'error',
				{
					'newlines-between': 'always',
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'type',
					],
					alphabetize: {
						order:
							'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
						caseInsensitive: true /* ignore case. Options: [true, false] */,
					},
					named: {
						enabled: true,
					},
				},
			],
		},
		settings: {
			'import-x/resolver-next': [
				createTypeScriptImportResolver({
					// NOTE: 项目需要有个 tsconfig.json 文件
					project: './tsconfig.json',
				}),
				createNodeResolver(),
			],
		},
	},

	// oxlint should be the last one
	// Turn off all rules already supported by oxlint.
	// https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/rules.rs
	...oxlint.configs['flat/recommended'],

	{
		name: 'ignores',
		ignores: [
			'node_modules/',
			'dist/',
			'build/',
			'out/',
			'.next/',
			'.turbo/',
			'coverage/',
			'.react-router/',
			'next-env.d.ts',
		],
	},
	{
		name: 'custom',
		rules: {
			// https://typescript-eslint.io/rules/consistent-type-imports/
			// 自动改为type引用
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					// 允许type T = import('Foo').Foo;
					disallowTypeAnnotations: false,
					prefer: 'type-imports',
				},
			],

			// Override or add rule settings here, such as:
			// 'svelte/rule-name': 'error'
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],

			'no-console': 'off',
			// 'no-restricted-syntax': [
			// 	'error',
			// 	{
			// 		selector:
			// 			"CallExpression[callee.object.name='console'][callee.property.name=/^(log|warn|error|info|trace)$/]",
			// 		message:
			// 			'Unexpected property on console object was called, you should use logger imported from @x-pkg/logger instead',
			// 	},
			// ],
		},
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
	},
];
