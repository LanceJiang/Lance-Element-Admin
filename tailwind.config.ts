/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	corePlugins: {
		preflight: false
	},
	theme: {
		screens: {
			mobile: { max: '750px' }, // 最大宽 750
			pc: '751px', // 最小宽 751
			sm: '640px',
			// => @media (min-width: 640px) { ... }

			md: '768px',
			// => @media (min-width: 768px) { ... }

			lg: '1024px',
			// => @media (min-width: 1024px) { ... }

			xl: '1440px',
			// => @media (min-width: 1440px) { ... }

			'2xl': '1536px'
			// => @media (min-width: 1536px) { ... }
		},
		colors: {
			primary: 'var(--el-color-primary)',
			error: 'var(--el-color-error)',
			warning: 'var(--el-color-warning)',
			success: 'var(--el-color-success)'
			// blue: '#1fb6ff',
			// pink: '#ff49db',
			// orange: '#ff7849',
			// green: '#13ce66',
			// 'gray-dark': '#273444',
			// gray: '#8492a6',
			// 'gray-light': '#d3dce6'
		},
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
