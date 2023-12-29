/** @type {import('tailwindcss').Config} */
export default {
	content: ['./.vitepress/**/*.{vue,js,ts,jsx,tsx,.md}', './component/**/*.{vue,js,ts,jsx,tsx,.md}', './examples/**/*.{vue,js,ts,jsx,tsx,.md}'],
	theme: {
		extend: {}
	},
	plugins: [],
	// 这部分 css 需要通过比较复杂的计算得出，所以要用 `safelist` 保证它们出现在最终 css 里
	safelist: [
		{
			pattern: /w-\d+\/\d+/
		},
		{
			pattern: /grid-cols-[5-9]/
		}
	]
}
