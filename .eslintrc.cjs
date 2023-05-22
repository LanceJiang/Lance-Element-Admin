module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		es2021: true
	},
	parser: 'vue-eslint-parser',
	extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module'
	},
	rules: {
		'no-console': 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'vue/multi-word-component-names': 'off',
		'@typescript-eslint/no-empty-function': 'off', // 关闭空方法
		'@typescript-eslint/no-explicit-any': 'off', // 关闭any类型的警告
		'vue/no-v-model-argument': 'off'
	}
}
