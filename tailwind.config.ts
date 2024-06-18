/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	corePlugins: {
		preflight: false
	},
	theme: {
		extend: {}
	},
	plugins: []
	/*// 这部分 css 需要通过比较复杂的计算得出，所以要用 `safelist` 保证它们出现在最终 css 里
	safelist: [
		{
			pattern: /w-\d+\/\d+/
		},
		{
			pattern: /grid-cols-[5-9]/
		}
	]*/
} satisfies Config
